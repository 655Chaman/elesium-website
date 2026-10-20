/**
 * Mathematical Simulation Model for
 * Tool #34: Enterprise Autonomous Agent Spiking Neural Network (SNN) Leaky Integrate-and-Fire Event Neuromorphic Simulator
 *
 * Implements rigorous computational neuroscience differential equations:
 * Leaky Integrate-and-Fire (LIF) membrane dynamics tau_m * dV/dt = -(V - V_rest) + R_m * I(t),
 * threshold spike emissions V(t) >= V_th with refractory periods, Address-Event Representation (AER),
 * and event-driven synaptic sparsity scaling.
 */

export interface SnnInputs {
    neuronModel: 'lif_standard' | 'alif_adaptive_threshold' | 'izhikevich_bifurcation' | 'glif_generalized';
    temporalEncodingScheme: 'rate_coding' | 'time_to_first_spike' | 'burst_phase_coding' | 'direct_event_aer';
    membraneTimeConstantMs: number;     // 2.0 to 50.0 ms (tau_m)
    synapticThresholdMv: number;         // 10.0 to 50.0 mV (V_th - V_rest)
    inputEventRateKhz: number;           // 0.5 to 100.0 kHz
    dailyEventWorkloadMillions: number;  // 10 to 5000 Million events/day
    currency: 'INR' | 'USD';
}

export interface MembraneTracePoint {
    timeStepMs: number;
    membranePotentialMv: number;
    isSpikeEmitted: boolean;
    adaptiveThresholdMv: number;
}

export interface SnnOutputs {
    meanFiringRateHz: number;               // Average output spike rate (Hz)
    eventSparsityPercent: number;           // Sparsity ratio (% time steps with 0 compute)
    temporalLatencyMs: number;              // Latency to decision/classification (ms)
    energyPerSpikePicojoules: number;       // Energy per synaptic event (pJ/SOP)
    gpuSynchronousBaselineEnergyPj: number;// Digital GPU dense baseline (pJ/op)
    neuromorphicPowerReductionFactor: number;// Energy reduction multiplier (e.g. 48.5x)
    systemThroughputMegaEventsPerSec: number;// MEPS throughput
    annualPowerCostSavings: number;         // Financial OPEX savings
    statusClassification: 'EVENT_DRIVEN_SUPREMACY' | 'BURSTING_LIMIT_CYCLE' | 'SPARSITY_ATTENUATED';
    membraneTrace: MembraneTracePoint[];
}

export function simulateSnn(inputs: SnnInputs): SnnOutputs {
    const {
        neuronModel,
        temporalEncodingScheme,
        membraneTimeConstantMs,
        synapticThresholdMv,
        inputEventRateKhz,
        dailyEventWorkloadMillions,
        currency
    } = inputs;

    // 1. Biological Constants
    const V_REST_MV = -70.0;
    const V_RESET_MV = -75.0;
    const REFRACTORY_PERIOD_MS = 2.0;

    // 2. Numerical Simulation of Membrane Potential Trace (100 time steps, dt = 0.5 ms -> 50 ms window)
    const DT_MS = 0.5;
    const TOTAL_STEPS = 100;
    const membraneTrace: MembraneTracePoint[] = [];

    let currentV = V_REST_MV;
    let refractoryRemainingMs = 0.0;
    let adaptiveThreshold = V_REST_MV + synapticThresholdMv;
    let totalSpikesEmitted = 0;

    // Input current scaling based on inputEventRateKhz and encoding
    const inputCurrentBase = (inputEventRateKhz * 0.85) * (temporalEncodingScheme === 'time_to_first_spike' ? 1.6 : 1.0);

    for (let step = 0; step < TOTAL_STEPS; step++) {
        const t = step * DT_MS;
        let isSpike = false;

        if (refractoryRemainingMs > 0) {
            refractoryRemainingMs -= DT_MS;
            currentV = V_RESET_MV;
        } else {
            // Leak term: -(V - V_rest) / tau_m
            const leak = -(currentV - V_REST_MV) / membraneTimeConstantMs;

            // Input current with sinusoidal bursts and stochastic noise
            const pulseFactor = temporalEncodingScheme === 'burst_phase_coding'
                ? Math.max(0, Math.sin(t * 0.35)) * 1.5
                : 1.0;
            const stochasticCurrent = inputCurrentBase * pulseFactor * (0.8 + 0.4 * Math.sin(t * 0.8 + 1.2));

            // Differential update
            currentV += (leak + stochasticCurrent) * DT_MS;

            // Check threshold crossing
            if (currentV >= adaptiveThreshold) {
                isSpike = true;
                totalSpikesEmitted++;
                refractoryRemainingMs = REFRACTORY_PERIOD_MS;
                currentV = 20.0; // Action potential peak for visualization

                if (neuronModel === 'alif_adaptive_threshold') {
                    adaptiveThreshold += 4.5; // Spike-frequency adaptation
                }
            } else {
                // Adaptive threshold decay back to resting threshold
                if (neuronModel === 'alif_adaptive_threshold') {
                    adaptiveThreshold -= (adaptiveThreshold - (V_REST_MV + synapticThresholdMv)) * 0.08 * DT_MS;
                }
            }
        }

        membraneTrace.push({
            timeStepMs: Number(t.toFixed(1)),
            membranePotentialMv: Number(currentV.toFixed(1)),
            isSpikeEmitted: isSpike,
            adaptiveThresholdMv: Number(adaptiveThreshold.toFixed(1))
        });
    }

    // 3. Temporal Performance & Sparsity Metrics
    const simulationDurationSeconds = (TOTAL_STEPS * DT_MS) / 1000.0;
    const meanFiringRateHz = Number((totalSpikesEmitted / simulationDurationSeconds).toFixed(1));

    // Event sparsity: percentage of silent time steps
    const silentSteps = TOTAL_STEPS - totalSpikesEmitted;
    const eventSparsityPercent = Number(((silentSteps / TOTAL_STEPS) * 100.0).toFixed(1));

    // Latency to decision: Time-to-First-Spike or first 3 spikes
    const firstSpikeIndex = membraneTrace.findIndex(pt => pt.isSpikeEmitted);
    const temporalLatencyMs = firstSpikeIndex >= 0 ? Number((firstSpikeIndex * DT_MS).toFixed(2)) : 50.0;

    // 4. Energy Efficiency (pJ/SOP vs GPU Dense Baseline)
    // Synchronous GPU executes dense tensor MACs regardless of zeros (~1,800 pJ per token/op)
    const gpuSynchronousBaselineEnergyPj = 1800.0;

    // SNN consumes energy ONLY during active spikes:
    // Sub-threshold integration: ~0.15 pJ; Spike emission & axonal fan-out: ~8 - 25 pJ
    let baseSpikeEnergyPj = 12.5;
    if (neuronModel === 'izhikevich_bifurcation') baseSpikeEnergyPj = 18.0;
    if (neuronModel === 'lif_standard') baseSpikeEnergyPj = 8.5;

    const dynamicEnergyPj = (baseSpikeEnergyPj * (1.0 - (eventSparsityPercent / 100.0))) + 0.35;
    const energyPerSpikePicojoules = Number(dynamicEnergyPj.toFixed(2));
    const neuromorphicPowerReductionFactor = Number((gpuSynchronousBaselineEnergyPj / energyPerSpikePicojoules).toFixed(1));

    // System Throughput in Million Events Per Second (MEPS)
    const systemThroughputMegaEventsPerSec = Number((inputEventRateKhz * (1.0 + (meanFiringRateHz / 100.0))).toFixed(1));

    // 5. Macro Financial & Power OPEX Savings
    // Daily events (millions) -> Joules saved
    const dailyEventsTotal = dailyEventWorkloadMillions * 1e6;
    const gpuJoulesDaily = dailyEventsTotal * (gpuSynchronousBaselineEnergyPj * 1e-12);
    const snnJoulesDaily = dailyEventsTotal * (energyPerSpikePicojoules * 1e-12);
    const dailyJoulesSaved = Math.max(0, gpuJoulesDaily - snnJoulesDaily);

    const PUE = 1.35;
    const dailyKwhSaved = Math.round((dailyJoulesSaved / 3.6e6) * PUE);
    const kwhCost = currency === 'INR' ? 9.50 : 0.15;
    const annualPowerCostSavings = Math.round(dailyKwhSaved * kwhCost * 365);

    // 6. Classification Status
    let statusClassification: 'EVENT_DRIVEN_SUPREMACY' | 'BURSTING_LIMIT_CYCLE' | 'SPARSITY_ATTENUATED';
    if (eventSparsityPercent < 75.0 || meanFiringRateHz > 250.0) {
        statusClassification = 'BURSTING_LIMIT_CYCLE';
    } else if (neuromorphicPowerReductionFactor >= 30.0 && eventSparsityPercent >= 85.0) {
        statusClassification = 'EVENT_DRIVEN_SUPREMACY';
    } else {
        statusClassification = 'SPARSITY_ATTENUATED';
    }

    return {
        meanFiringRateHz,
        eventSparsityPercent,
        temporalLatencyMs,
        energyPerSpikePicojoules,
        gpuSynchronousBaselineEnergyPj,
        neuromorphicPowerReductionFactor,
        systemThroughputMegaEventsPerSec,
        annualPowerCostSavings,
        statusClassification,
        membraneTrace
    };
}
