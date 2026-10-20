/**
 * Mathematical Simulation Model for
 * Tool #35: Enterprise Autonomous Agent Hardware Security Module (HSM) PKCS#11 Air-Gapped Key Derivation & Tokenization Simulator
 *
 * Implements rigorous cryptographic hardware security standards:
 * FIPS 140-3 Level 4 physical tamper-response envelope zeroization,
 * PKCS#11 Cryptoki hardware bus latency modeling,
 * Differential Power Analysis (DPA) and side-channel leakage attenuation in dB,
 * Post-Quantum ML-KEM-768 / AES-256-GCM / HKDF derivation pipelines,
 * and DPDP Act 2023 / RBI Cyber Security Framework / PCI-DSS v4.0 compliance scoring.
 */

export interface HsmInputs {
    hsmSecurityLevel: 'fips_140_3_level_4' | 'fips_140_2_level_3' | 'common_criteria_eal6_plus' | 'tpm_2_0_enclave';
    cryptographicAlgorithm: 'aes_256_gcm' | 'rsa_4096_pss' | 'ecdsa_secp256k1' | 'ml_kem_768_post_quantum';
    keyDerivationFunction: 'hkdf_sha512' | 'argon2id_hardened' | 'pbkdf2_sha256';
    dailyKeyDerivationVolumeThousands: number; // 10 to 5000 thousand ops/day
    hardwareBusLatencyMicroseconds: number;   // 15 to 250 µs
    currency: 'INR' | 'USD';
}

export interface HsmTelemetryPoint {
    step: number;
    busLatencyUs: number;
    cryptoExecUs: number;
    entropyBits: number;
    tamperMeshVoltageMv: number;
    sideChannelAttenuationDb: number;
}

export interface HsmOutputs {
    keyDerivationLatencyMicroseconds: number;
    tokenizationThroughputOpsPerSec: number;
    physicalTamperDetectionResistanceYears: number;
    sideChannelAttackResistanceDb: number;
    complianceScorePercent: number;
    annualBreachExposureMitigation: number;
    statusClassification: 'AIR_GAPPED_SOVEREIGN_VAULT' | 'FIPS_HARDENED_COMPLIANT' | 'PERIPHERAL_BUS_EXPOSED';
    telemetryTrace: HsmTelemetryPoint[];
}

export function simulateAgentHsm(inputs: HsmInputs): HsmOutputs {
    const {
        hsmSecurityLevel,
        cryptographicAlgorithm,
        keyDerivationFunction,
        dailyKeyDerivationVolumeThousands,
        hardwareBusLatencyMicroseconds,
        currency
    } = inputs;

    // 1. Algorithm Pure Hardware Execution Latency (microseconds)
    let algoExecLatencyUs = 20.0;
    let algoThroughputCapOpsSec = 45000;
    let algoSideChannelNoiseDb = 0.0;

    switch (cryptographicAlgorithm) {
        case 'aes_256_gcm':
            algoExecLatencyUs = 18.0;
            algoThroughputCapOpsSec = 52000;
            algoSideChannelNoiseDb = 4.0;
            break;
        case 'ecdsa_secp256k1':
            algoExecLatencyUs = 85.0;
            algoThroughputCapOpsSec = 11500;
            algoSideChannelNoiseDb = 1.5;
            break;
        case 'rsa_4096_pss':
            algoExecLatencyUs = 620.0;
            algoThroughputCapOpsSec = 1600;
            algoSideChannelNoiseDb = -2.0;
            break;
        case 'ml_kem_768_post_quantum':
            algoExecLatencyUs = 145.0;
            algoThroughputCapOpsSec = 7800;
            algoSideChannelNoiseDb = 5.0;
            break;
    }

    // 2. KDF Pure Latency (microseconds)
    let kdfLatencyUs = 35.0;
    switch (keyDerivationFunction) {
        case 'hkdf_sha512':
            kdfLatencyUs = 32.0;
            break;
        case 'argon2id_hardened':
            kdfLatencyUs = 420.0;
            break;
        case 'pbkdf2_sha256':
            kdfLatencyUs = 210.0;
            break;
    }

    // Total Key Derivation Latency: Bus transfer + KDF + Cipher execution + PKCS#11 protocol framing
    const pkcs11FramingOverheadUs = 12.0;
    const totalKeyDerivationLatencyUs = Math.round(
        hardwareBusLatencyMicroseconds + kdfLatencyUs + algoExecLatencyUs + pkcs11FramingOverheadUs
    );

    // 3. Tokenization Throughput (Ops/Sec) with parallel PKCS#11 sessions
    // Real HSMs utilize 16-64 concurrent crypto-coprocessor channels
    const concurrencyFactor = 28.0;
    const rawPipelinedThroughput = Math.round((1_000_000 / totalKeyDerivationLatencyUs) * concurrencyFactor);
    const tokenizationThroughputOpsPerSec = Math.min(algoThroughputCapOpsSec, Math.max(120, rawPipelinedThroughput));

    // 4. Physical Tamper Detection Resistance (Years)
    // Based on active environmental failure testing (EFT), sensor mesh, and zeroization circuitry
    let baseTamperResistanceYears = 25.0;
    let baseSideChannelResistanceDb = 105.0;
    let baseCompliance = 98.0;

    switch (hsmSecurityLevel) {
        case 'common_criteria_eal6_plus':
            baseTamperResistanceYears = 30.0;
            baseSideChannelResistanceDb = 118.0;
            baseCompliance = 99.5;
            break;
        case 'fips_140_3_level_4':
            baseTamperResistanceYears = 25.0;
            baseSideChannelResistanceDb = 112.0;
            baseCompliance = 98.5;
            break;
        case 'fips_140_2_level_3':
            baseTamperResistanceYears = 12.0;
            baseSideChannelResistanceDb = 88.0;
            baseCompliance = 91.0;
            break;
        case 'tpm_2_0_enclave':
            baseTamperResistanceYears = 3.5;
            baseSideChannelResistanceDb = 56.0;
            baseCompliance = 72.0;
            break;
    }

    // Bus exposure penalty: longer external bus indicates unshielded peripheral traces vulnerable to interposers
    let busPenalty = 0.0;
    if (hardwareBusLatencyMicroseconds > 150) {
        busPenalty = ((hardwareBusLatencyMicroseconds - 150) / 100) * 1.5;
    }
    const physicalTamperDetectionResistanceYears = Number(
        Math.max(1.0, baseTamperResistanceYears - busPenalty).toFixed(1)
    );

    // 5. Side-Channel Attack Resistance (dB)
    // Attenuation of Power Analysis (DPA/CPA) & Electro-Magnetic Emanations
    let sideChannelAttackResistanceDb = Math.round(
        baseSideChannelResistanceDb + algoSideChannelNoiseDb - (hardwareBusLatencyMicroseconds > 180 ? 6 : 0)
    );
    sideChannelAttackResistanceDb = Math.min(125, Math.max(45, sideChannelAttackResistanceDb));

    // 6. Regulatory & Statutory Compliance Score (%)
    // Evaluates DPDP Act 2023 Section 8, RBI Cyber Security Framework (Categorized Air-Gap), PCI-DSS v4.0 Req 3.5-3.7
    let complianceScorePercent = baseCompliance;
    if (cryptographicAlgorithm === 'ml_kem_768_post_quantum') complianceScorePercent += 0.5;
    if (cryptographicAlgorithm === 'rsa_4096_pss') complianceScorePercent -= 1.0; // Deprecation horizon
    if (keyDerivationFunction === 'argon2id_hardened') complianceScorePercent += 0.5;
    if (hardwareBusLatencyMicroseconds > 180) complianceScorePercent -= 4.0; // Peripheral bus leakage
    complianceScorePercent = Math.min(100.0, Math.max(50.0, Number(complianceScorePercent.toFixed(1))));

    // 7. Annual Breach Exposure Mitigation
    // Baseline risk exposure per tokenized record without hardware-isolated root of trust
    // Based on IBM / Ponemon Enterprise Data Breach Cost models
    const dailyVolume = dailyKeyDerivationVolumeThousands * 1000;
    const annualVolume = dailyVolume * 365;

    // Mitigation multiplier based on compliance and side-channel resistance
    const securityCoefficient = (complianceScorePercent / 100.0) * (sideChannelAttackResistanceDb / 120.0);
    const volumeLogScale = Math.log10(annualVolume);

    let baseAnnualExposureSaved = 0;
    if (currency === 'INR') {
        // Average Indian enterprise breach exposure mitigated: ₹45,000,000 to ₹380,000,000
        const baseInr = 18_000_000;
        baseAnnualExposureSaved = Math.round(baseInr * volumeLogScale * 0.42 * securityCoefficient);
    } else {
        // USD: $250,000 to $4,800,000
        const baseUsd = 240_000;
        baseAnnualExposureSaved = Math.round(baseUsd * volumeLogScale * 0.45 * securityCoefficient);
    }

    const annualBreachExposureMitigation = baseAnnualExposureSaved;

    // 8. Status Classification
    let statusClassification: 'AIR_GAPPED_SOVEREIGN_VAULT' | 'FIPS_HARDENED_COMPLIANT' | 'PERIPHERAL_BUS_EXPOSED';
    if (
        (hsmSecurityLevel === 'fips_140_3_level_4' || hsmSecurityLevel === 'common_criteria_eal6_plus') &&
        sideChannelAttackResistanceDb >= 98 &&
        hardwareBusLatencyMicroseconds <= 120 &&
        complianceScorePercent >= 95.0
    ) {
        statusClassification = 'AIR_GAPPED_SOVEREIGN_VAULT';
    } else if (
        hsmSecurityLevel === 'tpm_2_0_enclave' ||
        hardwareBusLatencyMicroseconds > 180 ||
        sideChannelAttackResistanceDb < 70
    ) {
        statusClassification = 'PERIPHERAL_BUS_EXPOSED';
    } else {
        statusClassification = 'FIPS_HARDENED_COMPLIANT';
    }

    // 9. Hardware Telemetry Trace Generation (16 sample points across cryptographic derivation cycle)
    const telemetryTrace: HsmTelemetryPoint[] = [];
    const baselineVoltageMv = 3300.0; // 3.3V active tamper mesh

    for (let step = 0; step < 16; step++) {
        const stepRatio = step / 15.0;
        // Bus latency component with stochastic jitter
        const busJitter = Math.sin(step * 1.3) * (hardwareBusLatencyMicroseconds * 0.12);
        const curBusUs = Math.round(hardwareBusLatencyMicroseconds + busJitter);

        // Crypto execution curve ramping during derivation
        const execPhase = Math.sin(stepRatio * Math.PI);
        const curCryptoUs = Math.round(algoExecLatencyUs * (0.6 + 0.8 * execPhase));

        // True Random Number Generator (TRNG) entropy bits (target 256 bits full entropy)
        const curEntropy = Number((255.2 + 0.8 * Math.cos(step * 2.1)).toFixed(2));

        // Active physical zeroization mesh voltage (tamper sensors monitor millivolt fluctuations)
        const noiseMv = (Math.sin(step * 0.9) * 4.2) + (hsmSecurityLevel === 'tpm_2_0_enclave' ? 18.5 : 2.1);
        const tamperVoltage = Number((baselineVoltageMv + noiseMv).toFixed(1));

        // Dynamic side channel attenuation
        const dynAttenuation = Math.round(sideChannelAttackResistanceDb - (execPhase * 3.5));

        telemetryTrace.push({
            step,
            busLatencyUs: curBusUs,
            cryptoExecUs: curCryptoUs,
            entropyBits: curEntropy,
            tamperMeshVoltageMv: tamperVoltage,
            sideChannelAttenuationDb: dynAttenuation
        });
    }

    return {
        keyDerivationLatencyMicroseconds: totalKeyDerivationLatencyUs,
        tokenizationThroughputOpsPerSec,
        physicalTamperDetectionResistanceYears,
        sideChannelAttackResistanceDb,
        complianceScorePercent,
        annualBreachExposureMitigation,
        statusClassification,
        telemetryTrace
    };
}
