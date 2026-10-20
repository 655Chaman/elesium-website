export interface NemoGuardrailInputs {
  guardrailEngine: 'nemo_colang_2' | 'llama_guard_3_8b' | 'lakera_v2_regex_hybrid' | 'custom_embeddings_svm';
  concurrencyThroughputRps: number;
  jailbreakAttackVector: 'multi_turn_crescendo' | 'base64_indirect_injection' | 'system_override_jailbreak' | 'tool_call_exfiltration';
  strictnessPolicy: 'zero_tolerance_dpdp' | 'enterprise_balanced' | 'low_latency_advisory';
  vernacularEvaluationEnabled: boolean;
  currency: 'INR' | 'USD';
}

export interface TelemetryPoint {
  index: number;
  interceptLatencyMs: number;
  mitigationRatePct: number;
}

export interface NemoGuardrailOutputs {
  interceptLatencyMs: number;
  jailbreakDetectionRatePct: number;
  falsePositiveRejectionPct: number;
  piiMaskingLatencyMicroseconds: number;
  dpdpComplianceConfidencePct: number;
  annualBreachLossMitigated: number;
  statusClassification: 'AIR_GAPPED_NEUTRALIZED' | 'HARDENED_GUARDRAILS' | 'POTENTIAL_INJECTION_RISK';
  telemetryTrace: TelemetryPoint[];
}

export function simulateNemoGuardrailTelemetry(inputs: NemoGuardrailInputs): NemoGuardrailOutputs {
  const {
    guardrailEngine,
    concurrencyThroughputRps,
    jailbreakAttackVector,
    strictnessPolicy,
    vernacularEvaluationEnabled,
    currency
  } = inputs;

  // Baseline latencies per engine (ms)
  let baseLatencyMs = 11.2;
  let baseDetectionRate = 99.4;
  let baseFalsePositive = 0.8;
  let basePiiLatencyUs = 820; // 0.82ms

  switch (guardrailEngine) {
    case 'nemo_colang_2':
      baseLatencyMs = 9.8;
      baseDetectionRate = 99.7;
      baseFalsePositive = 0.5;
      basePiiLatencyUs = 650;
      break;
    case 'llama_guard_3_8b':
      baseLatencyMs = 24.5;
      baseDetectionRate = 98.8;
      baseFalsePositive = 1.4;
      basePiiLatencyUs = 1200;
      break;
    case 'lakera_v2_regex_hybrid':
      baseLatencyMs = 16.8;
      baseDetectionRate = 96.2;
      baseFalsePositive = 2.8;
      basePiiLatencyUs = 950;
      break;
    case 'custom_embeddings_svm':
      baseLatencyMs = 14.1;
      baseDetectionRate = 94.5;
      baseFalsePositive = 3.6;
      basePiiLatencyUs = 1400;
      break;
  }

  // Attack Vector impact
  let attackDifficultyFactor = 1.0;
  if (jailbreakAttackVector === 'multi_turn_crescendo') {
    attackDifficultyFactor = 0.985;
    baseLatencyMs += 2.4;
  } else if (jailbreakAttackVector === 'base64_indirect_injection') {
    attackDifficultyFactor = 0.991;
    baseLatencyMs += 1.8;
  } else if (jailbreakAttackVector === 'tool_call_exfiltration') {
    attackDifficultyFactor = 0.988;
    baseLatencyMs += 2.1;
  }

  // Strictness Policy modifiers
  let policyConfidenceModifier = 1.0;
  if (strictnessPolicy === 'zero_tolerance_dpdp') {
    baseDetectionRate = Math.min(99.9, baseDetectionRate * 1.004);
    baseFalsePositive += 0.4;
    baseLatencyMs += 1.5;
    policyConfidenceModifier = 1.05;
  } else if (strictnessPolicy === 'low_latency_advisory') {
    baseDetectionRate *= 0.97;
    baseFalsePositive = Math.max(0.1, baseFalsePositive - 0.5);
    baseLatencyMs *= 0.75;
    policyConfidenceModifier = 0.92;
  }

  // Vernacular dialect evaluation
  if (vernacularEvaluationEnabled) {
    baseLatencyMs += 2.2;
    baseDetectionRate = Math.min(99.9, baseDetectionRate * 1.002);
  } else {
    // If vernacular is disabled, attack vectors with Indic idioms slip through
    baseDetectionRate *= 0.95;
  }

  // Concurrency scaling: minor queue degradation under extreme throughput (>2000 RPS)
  const queueFactor = Math.max(1.0, 1.0 + (concurrencyThroughputRps / 10000));
  const finalLatencyMs = Number((baseLatencyMs * queueFactor).toFixed(2));
  const finalDetectionRate = Number((baseDetectionRate * attackDifficultyFactor).toFixed(2));
  const finalFalsePositive = Number(baseFalsePositive.toFixed(2));
  const finalPiiLatencyUs = Math.round(basePiiLatencyUs * queueFactor);

  const rawCompliance = Math.min(99.9, (finalDetectionRate * 0.7) + (100 - finalFalsePositive) * 0.3 * policyConfidenceModifier);
  const dpdpComplianceConfidencePct = Number(rawCompliance.toFixed(2));

  // Breach loss mitigated estimation
  const baseBreachRiskUsd = 2800000; // Average enterprise data breach cost: $2.8M
  const mitigationMultiplier = (finalDetectionRate / 100) * (concurrencyThroughputRps / 250);
  let breachMitigated = baseBreachRiskUsd * mitigationMultiplier;

  if (currency === 'INR') {
    // Conversion rate ₹86.5 / USD
    breachMitigated *= 86.5;
  }
  const annualBreachLossMitigated = Math.round(breachMitigated);

  let statusClassification: 'AIR_GAPPED_NEUTRALIZED' | 'HARDENED_GUARDRAILS' | 'POTENTIAL_INJECTION_RISK' = 'HARDENED_GUARDRAILS';
  if (finalDetectionRate >= 99.0 && finalLatencyMs <= 20.0) {
    statusClassification = 'AIR_GAPPED_NEUTRALIZED';
  } else if (finalDetectionRate < 96.0 || finalLatencyMs > 35.0) {
    statusClassification = 'POTENTIAL_INJECTION_RISK';
  }

  // Generate 20 telemetry waveform points
  const telemetryTrace: TelemetryPoint[] = [];
  for (let i = 0; i < 20; i++) {
    const jitter = Math.sin(i * 0.6) * 1.8 + (Math.cos(i * 1.2) * 1.1);
    const traceLat = Math.max(4.0, finalLatencyMs + jitter);
    const traceMit = Math.min(100.0, Math.max(85.0, finalDetectionRate - (Math.abs(jitter) * 0.2)));
    telemetryTrace.push({
      index: i,
      interceptLatencyMs: Number(traceLat.toFixed(2)),
      mitigationRatePct: Number(traceMit.toFixed(2))
    });
  }

  return {
    interceptLatencyMs: finalLatencyMs,
    jailbreakDetectionRatePct: finalDetectionRate,
    falsePositiveRejectionPct: finalFalsePositive,
    piiMaskingLatencyMicroseconds: finalPiiLatencyUs,
    dpdpComplianceConfidencePct,
    annualBreachLossMitigated,
    statusClassification,
    telemetryTrace
  };
}
