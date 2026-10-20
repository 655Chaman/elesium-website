export interface AiOpsInputs {
  clusterSizeNodes: number;
  chaosFaultVector: 'pod_network_partition' | 'memory_leak_oom' | 'database_connection_starvation' | 'thread_deadlock_cascade';
  remediationEngine: 'agentic_ebpf_mesh' | 'rule_based_webhook' | 'manual_sre_warroom' | 'heuristic_autoscaler';
  canaryVerificationStrictness: 'zero_loss_canary' | 'fast_failover_balanced' | 'aggressive_pod_kill';
  currency: 'INR' | 'USD';
}

export interface TelemetryPoint {
  index: number;
  triageLatencyMs: number;
  slaAvailabilityPct: number;
}

export interface AiOpsOutputs {
  mttrSeconds: number;
  incidentAutoResolvedPct: number;
  falseAlertSuppressionPct: number;
  packetLevelTriageLatencyMs: number;
  slaUptimeAvailabilityPct: number;
  annualDowntimeSavings: number;
  statusClassification: 'AUTONOMOUS_SELF_HEALING' | 'CONTAINED_DEGRADATION' | 'CASCADING_OUTAGE_RISK';
  telemetryTrace: TelemetryPoint[];
}

export function simulateAiOpsTelemetry(inputs: AiOpsInputs): AiOpsOutputs {
  const {
    clusterSizeNodes,
    chaosFaultVector,
    remediationEngine,
    canaryVerificationStrictness,
    currency
  } = inputs;

  // Base metrics per engine
  let baseMttrSeconds = 4.8;
  let baseAutoResolvePct = 98.4;
  let baseSuppressionPct = 96.5;
  let baseTriageMs = 140;

  switch (remediationEngine) {
    case 'agentic_ebpf_mesh':
      baseMttrSeconds = 3.6;
      baseAutoResolvePct = 99.2;
      baseSuppressionPct = 98.2;
      baseTriageMs = 95;
      break;
    case 'rule_based_webhook':
      baseMttrSeconds = 180;
      baseAutoResolvePct = 68.5;
      baseSuppressionPct = 62.0;
      baseTriageMs = 1200;
      break;
    case 'heuristic_autoscaler':
      baseMttrSeconds = 240;
      baseAutoResolvePct = 52.0;
      baseSuppressionPct = 48.0;
      baseTriageMs = 2800;
      break;
    case 'manual_sre_warroom':
      baseMttrSeconds = 2700; // 45 mins
      baseAutoResolvePct = 12.0;
      baseSuppressionPct = 15.0;
      baseTriageMs = 18000;
      break;
  }

  // Chaos Fault Vector impact
  let faultDifficulty = 1.0;
  if (chaosFaultVector === 'thread_deadlock_cascade') {
    faultDifficulty = 1.15;
    baseMttrSeconds *= 1.2;
    baseAutoResolvePct *= 0.96;
  } else if (chaosFaultVector === 'database_connection_starvation') {
    faultDifficulty = 1.1;
    baseMttrSeconds *= 1.1;
  } else if (chaosFaultVector === 'pod_network_partition') {
    baseTriageMs *= 1.25;
  }

  // Canary strictness
  if (canaryVerificationStrictness === 'zero_loss_canary') {
    baseMttrSeconds += 1.2;
    baseAutoResolvePct = Math.min(99.9, baseAutoResolvePct * 1.005);
  } else if (canaryVerificationStrictness === 'aggressive_pod_kill') {
    baseMttrSeconds = Math.max(1.5, baseMttrSeconds * 0.7);
    baseAutoResolvePct *= 0.94;
  }

  // Scale impact (Nodes 10 -> 1000)
  const scalePenalty = 1.0 + (clusterSizeNodes / 2500);
  const finalMttr = Number((baseMttrSeconds * scalePenalty).toFixed(1));
  const finalAutoResolve = Number(Math.min(99.9, Math.max(10.0, baseAutoResolvePct / (scalePenalty * 0.98))).toFixed(1));
  const finalSuppression = Number(Math.min(99.9, Math.max(15.0, baseSuppressionPct)).toFixed(1));
  const finalTriage = Math.round(baseTriageMs * faultDifficulty);

  // SLA availability calculation
  let slaAvailability = 99.995;
  if (remediationEngine === 'manual_sre_warroom') {
    slaAvailability = 99.45;
  } else if (remediationEngine === 'rule_based_webhook') {
    slaAvailability = 99.85;
  } else if (remediationEngine === 'heuristic_autoscaler') {
    slaAvailability = 99.72;
  }
  const slaUptimeAvailabilityPct = Number(slaAvailability.toFixed(3));

  // Financial downtime savings estimation
  // Average downtime cost for high-scale enterprise: $9,000 / min
  const baselineDowntimeMinutesYear = 480; // 8 hours manual downtime/year
  const simulatedDowntimeMinutesYear = (finalMttr / 60) * 24; // 24 incidents/year
  const minutesSaved = Math.max(0, baselineDowntimeMinutesYear - simulatedDowntimeMinutesYear);
  let downtimeSavingsUsd = minutesSaved * 9000;

  if (currency === 'INR') {
    downtimeSavingsUsd *= 86.5;
  }
  const annualDowntimeSavings = Math.round(downtimeSavingsUsd);

  let statusClassification: 'AUTONOMOUS_SELF_HEALING' | 'CONTAINED_DEGRADATION' | 'CASCADING_OUTAGE_RISK' = 'CONTAINED_DEGRADATION';
  if (finalMttr <= 15.0 && finalAutoResolve >= 95.0) {
    statusClassification = 'AUTONOMOUS_SELF_HEALING';
  } else if (finalMttr > 300 || finalAutoResolve < 60.0) {
    statusClassification = 'CASCADING_OUTAGE_RISK';
  }

  // Generate 20 telemetry waveform points
  const telemetryTrace: TelemetryPoint[] = [];
  for (let i = 0; i < 20; i++) {
    const jitter = Math.sin(i * 0.5) * 15 + (Math.cos(i * 1.3) * 10);
    const traceTriage = Math.max(20, finalTriage + jitter);
    const traceSla = Math.min(100.0, Math.max(90.0, slaUptimeAvailabilityPct - (Math.abs(jitter) * 0.05)));
    telemetryTrace.push({
      index: i,
      triageLatencyMs: Math.round(traceTriage),
      slaAvailabilityPct: Number(traceSla.toFixed(2))
    });
  }

  return {
    mttrSeconds: finalMttr,
    incidentAutoResolvedPct: finalAutoResolve,
    falseAlertSuppressionPct: finalSuppression,
    packetLevelTriageLatencyMs: finalTriage,
    slaUptimeAvailabilityPct,
    annualDowntimeSavings,
    statusClassification,
    telemetryTrace
  };
}
