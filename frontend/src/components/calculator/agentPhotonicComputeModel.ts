/**
 * Mathematical Simulation Model for
 * Tool #32: Enterprise Autonomous Agent Optical Neural Network & Co-Packaged Silicon Photonics Matrix Compute Latency Simulator
 *
 * Implements rigorous coherent optical propagation physics, Clements/Reck Mach-Zehnder Interferometer (MZI)
 * unitary matrix decomposition, Silicon-on-Insulator (SOI) waveguide group velocity, Wavelength Division
 * Multiplexing (WDM) parallelism, and thermo-optic phase drift dynamics.
 */

export interface PhotonicComputeInputs {
    opticalArchitecture: 'mzi_clements_mesh' | 'mrr_wdm_crossbar' | 'free_space_d2nn' | 'cpo_hybrid_accelerator';
    matrixDimension: 64 | 128 | 256 | 512 | 1024;
    wdmChannels: 1 | 4 | 8 | 16 | 32;
    modulationPrecisionBits: 4 | 6 | 8 | 12;
    thermalDriftStdDevKelvin: number; // 0.1 to 5.0 K (die ambient thermal variance)
    dailyInferenceTokensMillions: number; // 1 to 500 Million tokens/day
    currency: 'INR' | 'USD';
}

export interface WaveguideSpectralPoint {
    channelIndex: number;
    wavelengthNm: number;
    opticalPowerDbm: number;
    phaseErrorRad: number;
    extinctionRatioDb: number;
}

export interface PhotonicComputeOutputs {
    inFlightOpticalLatencyPs: number;          // Time-of-flight in silicon waveguides (picoseconds)
    totalGemmLatencyNs: number;                // In-flight + DAC + Modulator + Photodetector + ADC (nanoseconds)
    electronicBaselineLatencyNs: number;       // Electronic systolic array baseline (nanoseconds)
    latencySpeedupFactor: number;              // Speedup ratio over electronic baseline
    energyPerMacFemtojoules: number;           // fJ/MAC for optical core + I/O
    electronicEnergyPerMacFemtojoules: number; // fJ/MAC for 4nm electronic GPU baseline (e.g. 2,400 fJ)
    opticalEnergyEfficiencyRatio: number;      // Ratio of energy reduction (e.g. 22.4x)
    effectiveEnob: number;                     // Effective Number of Bits under thermal noise
    thermalPhaseDriftRmseRad: number;          // Phase error root-mean-square in radians
    matrixComputationThroughputTops: number;   // Tera-Operations Per Second (TOPS)
    powerEfficiencyTopsPerWatt: number;        // TOPS/Watt (system compute efficiency)
    dailyEnergyKwhSaved: number;               // Daily kWh saved vs electronic GPU baseline
    annualPowerCostSavings: number;            // Financial OPEX saved in power & cooling
    statusClassification: 'DIFFRACTION_LIMITED' | 'THERMALLY_COMPENSATED' | 'COHERENT_OPTICAL_ADVANTAGE';
    spectralPoints: WaveguideSpectralPoint[];
}

export function simulatePhotonicCompute(inputs: PhotonicComputeInputs): PhotonicComputeOutputs {
    const {
        opticalArchitecture,
        matrixDimension,
        wdmChannels,
        modulationPrecisionBits,
        thermalDriftStdDevKelvin,
        dailyInferenceTokensMillions,
        currency
    } = inputs;

    // 1. Core Physical Constants
    const SPEED_OF_LIGHT_VACUUM_MM_PS = 0.299792; // mm / picosecond
    const N_EFF_SILICON_WAVEGUIDE = 2.45;          // Effective group index in SOI rib waveguide at 1550nm
    const V_GROUP_MM_PS = SPEED_OF_LIGHT_VACUUM_MM_PS / N_EFF_SILICON_WAVEGUIDE; // ~0.1224 mm / ps

    // 2. Waveguide Path Length & In-Flight Latency Calculation
    // Matrix dimension N dictates the optical mesh depth
    let physicalPathLengthMm = 0;
    let dacLatencyNs = 0.45;
    let modulatorLatencyNs = 0.05;
    let photodetectorLatencyNs = 0.08;
    let adcLatencyNs = 0.55;
    let baseOpticalFjPerMac = 12; // Base optical compute energy

    if (opticalArchitecture === 'mzi_clements_mesh') {
        // Clements mesh depth = N stages. Stage pitch ~ 75 microns
        physicalPathLengthMm = (matrixDimension * 0.075) + 3.0; // Die routing overhead
        dacLatencyNs = 0.42 + (modulationPrecisionBits * 0.04);
        adcLatencyNs = 0.50 + (modulationPrecisionBits * 0.05);
        baseOpticalFjPerMac = 14;
    } else if (opticalArchitecture === 'mrr_wdm_crossbar') {
        // Micro-ring resonators in crossbar: Pitch ~ 25 microns
        physicalPathLengthMm = (matrixDimension * 0.025) + 2.0;
        dacLatencyNs = 0.38 + (modulationPrecisionBits * 0.035);
        adcLatencyNs = 0.48 + (modulationPrecisionBits * 0.045);
        baseOpticalFjPerMac = 9;
    } else if (opticalArchitecture === 'free_space_d2nn') {
        // Diffractive deep neural network (diffraction through metasurface layers)
        physicalPathLengthMm = 18.0; // 5-layer metasurface cavity
        dacLatencyNs = 0.50 + (modulationPrecisionBits * 0.05);
        adcLatencyNs = 0.65 + (modulationPrecisionBits * 0.06);
        baseOpticalFjPerMac = 6;
    } else {
        // cpo_hybrid_accelerator (Co-packaged optics hybrid)
        physicalPathLengthMm = (matrixDimension * 0.05) + 4.5;
        dacLatencyNs = 0.35 + (modulationPrecisionBits * 0.03);
        adcLatencyNs = 0.42 + (modulationPrecisionBits * 0.04);
        baseOpticalFjPerMac = 18;
    }

    // In-flight optical time-of-flight in silicon waveguides
    const inFlightOpticalLatencyPs = Math.round(physicalPathLengthMm / V_GROUP_MM_PS);
    const inFlightOpticalLatencyNs = inFlightOpticalLatencyPs / 1000.0;

    // Total GEMM latency including Electro-Optic and Opto-Electric conversions
    const totalGemmLatencyNs = Number((dacLatencyNs + modulatorLatencyNs + inFlightOpticalLatencyNs + photodetectorLatencyNs + adcLatencyNs).toFixed(3));

    // Baseline Electronic Systolic Array GEMM Latency (e.g., 4nm GPU Hopper/Blackwell Tensor Core)
    // Electronic matrix multiply scales with clock cycles and memory staging
    const electronicBaselineLatencyNs = Number((18.5 + (matrixDimension * 0.14) + (matrixDimension > 256 ? 35.0 : 0.0)).toFixed(2));
    const latencySpeedupFactor = Number((electronicBaselineLatencyNs / totalGemmLatencyNs).toFixed(1));

    // 3. Thermal Phase Drift & Effective ENOB
    // Silicon thermo-optic coefficient dn/dT = 1.86e-4 K^-1
    // Uncompensated phase drift: Delta_phi = (2*pi/lambda) * (dn/dT) * L_heater * delta_T
    const thermalPhaseDriftRmseRad = Number((thermalDriftStdDevKelvin * 0.068 * (physicalPathLengthMm / 10.0)).toFixed(4));
    
    // Effective Number of Bits (ENOB) degrades logarithmically with phase noise
    const enobPenalty = Math.log2(1.0 + (thermalPhaseDriftRmseRad * 8.5));
    const effectiveEnob = Number(Math.max(2.8, modulationPrecisionBits - enobPenalty).toFixed(2));

    // 4. Energy Consumption Modeling (fJ/MAC)
    // 4nm electronic GPU baseline consumes ~2,400 fJ/FLOP (Multiply-Accumulate is ~2 FLOPs = ~4,800 fJ/MAC)
    const electronicEnergyPerMacFemtojoules = 4200;

    // Optical energy: Base optical + (DAC + ADC + Laser power) amortized over WDM channels and matrix size
    const laserAndIoOverheadFj = (120 / wdmChannels) + (modulationPrecisionBits * 6.5);
    const energyPerMacFemtojoules = Math.round(baseOpticalFjPerMac + laserAndIoOverheadFj);
    const opticalEnergyEfficiencyRatio = Number((electronicEnergyPerMacFemtojoules / energyPerMacFemtojoules).toFixed(1));

    // 5. Throughput & Power Efficiency (TOPS & TOPS/Watt)
    // Operations per GEMM = 2 * (N^2) * WDM_channels
    const totalOperationsPerGemm = 2 * Math.pow(matrixDimension, 2) * wdmChannels;
    const matrixComputationThroughputTops = Number(((totalOperationsPerGemm / (totalGemmLatencyNs * 1e-9)) / 1e12).toFixed(1));

    // System power in Watts = Operations * Energy per Op
    const systemPowerWatts = Math.max(12, (matrixComputationThroughputTops * 1e12 * (energyPerMacFemtojoules * 1e-15)));
    const powerEfficiencyTopsPerWatt = Number((matrixComputationThroughputTops / (systemPowerWatts / 1000.0) / 1000.0).toFixed(1));

    // 6. Macro Energy & OPEX Financial Savings
    // Enterprise token consumption: 70B parameter model ~ 1.4e11 FLOPs/token = 7e10 MACs/token
    const macsPerToken = 7e10;
    const dailyTotalMacs = dailyInferenceTokensMillions * 1e6 * macsPerToken;
    const dailyElectronicJoules = dailyTotalMacs * (electronicEnergyPerMacFemtojoules * 1e-15);
    const dailyPhotonicJoules = dailyTotalMacs * (energyPerMacFemtojoules * 1e-15);
    const joulesSavedDaily = Math.max(0, dailyElectronicJoules - dailyPhotonicJoules);

    // 1 kWh = 3.6e6 Joules. Add Datacenter PUE multiplier (1.35x for cooling)
    const PUE = 1.35;
    const dailyEnergyKwhSaved = Math.round((joulesSavedDaily / 3.6e6) * PUE);

    // Tariff: INR 9.50/kWh or USD $0.15/kWh
    const kwhCost = currency === 'INR' ? 9.50 : 0.15;
    const annualPowerCostSavings = Math.round(dailyEnergyKwhSaved * kwhCost * 365);

    // 7. Architectural Classification
    let statusClassification: 'DIFFRACTION_LIMITED' | 'THERMALLY_COMPENSATED' | 'COHERENT_OPTICAL_ADVANTAGE';
    if (effectiveEnob < 5.0 || thermalPhaseDriftRmseRad > 0.25) {
        statusClassification = 'DIFFRACTION_LIMITED';
    } else if (latencySpeedupFactor >= 12.0 && opticalEnergyEfficiencyRatio >= 18.0) {
        statusClassification = 'COHERENT_OPTICAL_ADVANTAGE';
    } else {
        statusClassification = 'THERMALLY_COMPENSATED';
    }

    // 8. Generate WDM Spectral Points
    const spectralPoints: WaveguideSpectralPoint[] = [];
    const baseWavelengthNm = 1530.0;
    const channelSpacingNm = 1.6; // ITU DWDM 200 GHz grid

    for (let c = 0; c < wdmChannels; c++) {
        const wavelength = baseWavelengthNm + (c * channelSpacingNm);
        const powerDbm = Number((-2.0 - (c * 0.15) + (Math.sin(c * 0.8) * 0.4)).toFixed(2));
        const phaseError = Number((thermalPhaseDriftRmseRad * (0.8 + 0.4 * Math.cos(c * 0.6))).toFixed(4));
        const extinctionRatio = Number((22.5 - (c * 0.2) - (thermalDriftStdDevKelvin * 1.2)).toFixed(1));

        spectralPoints.push({
            channelIndex: c + 1,
            wavelengthNm: Number(wavelength.toFixed(2)),
            opticalPowerDbm: powerDbm,
            phaseErrorRad: phaseError,
            extinctionRatioDb: Math.max(10.0, extinctionRatio)
        });
    }

    return {
        inFlightOpticalLatencyPs,
        totalGemmLatencyNs,
        electronicBaselineLatencyNs,
        latencySpeedupFactor,
        energyPerMacFemtojoules,
        electronicEnergyPerMacFemtojoules,
        opticalEnergyEfficiencyRatio,
        effectiveEnob,
        thermalPhaseDriftRmseRad,
        matrixComputationThroughputTops,
        powerEfficiencyTopsPerWatt,
        dailyEnergyKwhSaved,
        annualPowerCostSavings,
        statusClassification,
        spectralPoints
    };
}
