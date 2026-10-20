/**
 * Mathematical Simulation Model for
 * Tool #39: Enterprise Autonomous Agent ONDC Multi-Ecosystem Retail Inventory & Vernacular Dynamic Pricing Simulator
 *
 * Simulates retail omnichannel inventory allocation, Beckn protocol sync,
 * and algorithmic dynamic pricing telemetry:
 * - ONDC Beckn v1.2.0 catalog query and reservation sync latency,
 * - Hyperlocal dark store stockout rate reduction and phantom inventory elimination,
 * - Vernacular voice search parsing accuracy and cart conversion lift,
 * - Omnichannel gross margin uplift from dynamic markdown scheduling,
 * - and working capital optimization across Indian retail distribution hubs.
 */

export interface OndcRetailInputs {
    catalogSkuCount: number; // 1,000 to 100,000 SKUs
    ondcBuyerAppsConnected: number; // 1 to 20 Buyer Apps
    pricingStrategy: 'demand_elasticity' | 'expiry_decay_salvage' | 'competitor_arbitrage' | 'statutory_mrp_strict';
    stockReconciliationFrequency: 'sub_50ms_in_memory' | 'five_second_event_bus' | 'one_minute_batch';
    vernacularNluAccuracyPct: number; // 80.0 to 99.9%
    currency: 'INR' | 'USD';
}

export interface OndcRetailTelemetryPoint {
    step: number;
    syncLatencyMs: number;
    ondcThroughputRps: number;
    stockoutRatePct: number;
    marginUpliftPct: number;
    reconciliationStatus: 'BECKN_MUTEX_LOCKED' | 'REDIS_CACHE_HIT' | 'ERP_BATCH_SYNCED';
}

export interface OndcRetailOutputs {
    syncLatencyMs: number;
    inventoryStockoutReductionPct: number;
    omnichannelGrossMarginUpliftPct: number;
    ondcOrderThroughputRps: number;
    reconciliationSlaConfidencePct: number;
    annualWorkingCapitalSavings: number;
    statusClassification: 'SOVEREIGN_ONDC_BECKN_OPTIMAL' | 'SYNCHRONIZED_ACTIVE_ECOSYSTEM' | 'RECONCILIATION_LAGGING';
    telemetryTrace: OndcRetailTelemetryPoint[];
}

export function simulateOndcRetailTelemetry(inputs: OndcRetailInputs): OndcRetailOutputs {
    const {
        catalogSkuCount,
        ondcBuyerAppsConnected,
        pricingStrategy,
        stockReconciliationFrequency,
        vernacularNluAccuracyPct,
        currency
    } = inputs;

    // 1. Reconciliation Frequency Baseline Latency
    let baseSyncLatencyMs = 24.0;
    let baselineSlaConfidence = 99.95;

    switch (stockReconciliationFrequency) {
        case 'sub_50ms_in_memory':
            baseSyncLatencyMs = 18.5;
            baselineSlaConfidence = 99.99;
            break;
        case 'five_second_event_bus':
            baseSyncLatencyMs = 45.0;
            baselineSlaConfidence = 99.90;
            break;
        case 'one_minute_batch':
            baseSyncLatencyMs = 120.0;
            baselineSlaConfidence = 98.40;
            break;
    }

    // 2. Buyer Apps Scaling Overhead
    const buyerAppOverheadMs = (ondcBuyerAppsConnected - 1) * 1.8;
    const syncLatencyMs = Number((baseSyncLatencyMs + buyerAppOverheadMs).toFixed(1));

    // 3. Pricing Strategy Gross Margin Uplift
    let baseMarginUpliftPct = 12.5;

    switch (pricingStrategy) {
        case 'demand_elasticity':
            baseMarginUpliftPct = 16.8;
            break;
        case 'expiry_decay_salvage':
            baseMarginUpliftPct = 14.2;
            break;
        case 'competitor_arbitrage':
            baseMarginUpliftPct = 18.5;
            break;
        case 'statutory_mrp_strict':
            baseMarginUpliftPct = 9.4;
            break;
    }

    // Bonus from high vernacular accuracy (capturing vernacular voice shoppers)
    const vernacularBonus = (vernacularNluAccuracyPct - 90.0) * 0.25;
    const omnichannelGrossMarginUpliftPct = Number(
        Math.max(5.0, baseMarginUpliftPct + vernacularBonus).toFixed(1)
    );

    // 4. Stockout Reduction & Throughput
    const stockoutReductionBase = 82.0;
    const inventoryStockoutReductionPct = Number(
        Math.min(96.5, stockoutReductionBase + (100 - syncLatencyMs * 0.4)).toFixed(1)
    );

    // Throughput capacity based on SKU count and in-memory architecture
    const ondcOrderThroughputRps = Math.round(
        Math.max(450, 4800 - (catalogSkuCount / 1000) * 12 + ondcBuyerAppsConnected * 120)
    );

    const reconciliationSlaConfidencePct = Number(
        Math.min(99.999, baselineSlaConfidence).toFixed(3)
    );

    // 5. Economic Working Capital Savings
    // Typical Indian retail SKU holding value: ~₹1,200 ($14.5) average
    // Eliminating dead stock & phantom locks salvages ~6.5% of working capital
    const baseSavingsPerSkuInr = 285;
    const annualSavingsInr = catalogSkuCount * baseSavingsPerSkuInr * (inventoryStockoutReductionPct / 85.0);

    const annualWorkingCapitalSavings = currency === 'INR'
        ? Math.round(annualSavingsInr)
        : Math.round(annualSavingsInr / 86.5);

    // Status Classification
    let statusClassification: 'SOVEREIGN_ONDC_BECKN_OPTIMAL' | 'SYNCHRONIZED_ACTIVE_ECOSYSTEM' | 'RECONCILIATION_LAGGING';
    if (syncLatencyMs <= 35.0 && reconciliationSlaConfidencePct >= 99.95) {
        statusClassification = 'SOVEREIGN_ONDC_BECKN_OPTIMAL';
    } else if (syncLatencyMs <= 85.0) {
        statusClassification = 'SYNCHRONIZED_ACTIVE_ECOSYSTEM';
    } else {
        statusClassification = 'RECONCILIATION_LAGGING';
    }

    // 6. Generate 10-point Telemetry Trace
    const telemetryTrace: OndcRetailTelemetryPoint[] = [];
    for (let step = 1; step <= 10; step++) {
        const jitter = Math.sin(step * 1.6) * 2.5;
        const stepLatency = Number(Math.max(10.0, syncLatencyMs + jitter).toFixed(1));
        const stepThroughput = Math.round(ondcOrderThroughputRps + Math.cos(step * 1.2) * 180);
        const stepStockout = Number(Math.max(1.0, 14.2 - (inventoryStockoutReductionPct / 100) * 12.8 + (Math.sin(step) * 0.3)).toFixed(2));
        const stepMargin = Number((omnichannelGrossMarginUpliftPct + (Math.cos(step) * 0.4)).toFixed(1));

        let reconciliationStatus: 'BECKN_MUTEX_LOCKED' | 'REDIS_CACHE_HIT' | 'ERP_BATCH_SYNCED' = 'REDIS_CACHE_HIT';
        if (step % 3 === 0) {
            reconciliationStatus = 'BECKN_MUTEX_LOCKED';
        } else if (step % 5 === 0) {
            reconciliationStatus = 'ERP_BATCH_SYNCED';
        }

        telemetryTrace.push({
            step,
            syncLatencyMs: stepLatency,
            ondcThroughputRps: stepThroughput,
            stockoutRatePct: stepStockout,
            marginUpliftPct: stepMargin,
            reconciliationStatus
        });
    }

    return {
        syncLatencyMs,
        inventoryStockoutReductionPct,
        omnichannelGrossMarginUpliftPct,
        ondcOrderThroughputRps,
        reconciliationSlaConfidencePct,
        annualWorkingCapitalSavings,
        statusClassification,
        telemetryTrace
    };
}
