export type Currency = 'INR' | 'USD';
export type IndustryKey = 'logistics' | 'bfsi' | 'manufacturing' | 'healthcare' | 'erp';

export interface IndustryConfig {
    id: IndustryKey;
    name: string;
    tag: string;
    multiplier: number;
    baselineTurnaround: string;
    elesiumTurnaround: string;
    accelerationPct: number;
    description: string;
    keyUseCases: string[];
}

export const INDUSTRY_CONFIGS: Record<IndustryKey, IndustryConfig> = {
    logistics: {
        id: 'logistics',
        name: 'Logistics & Supply Chain',
        tag: 'Fleet & Dispatch',
        multiplier: 1.35,
        baselineTurnaround: '48 Hours (Manual Waybill / Dispatch)',
        elesiumTurnaround: '90 Seconds (Autonomous OCR & Route Match)',
        accelerationPct: 98.4,
        description: 'Multi-carrier OCR ingestion, automated 3PL dispatch tracking, and customs manifest validation.',
        keyUseCases: ['Waybill & BOL Extraction', '3PL Fleet Dispatch Matching', 'Customs Clearance Automation', 'Demurrage Penalty Prevention']
    },
    bfsi: {
        id: 'bfsi',
        name: 'BFSI & FinTech NBFC',
        tag: 'Underwriting & Audit',
        multiplier: 1.70,
        baselineTurnaround: '72 Hours (Manual Dossier Underwriting)',
        elesiumTurnaround: '14 Minutes (Deterministic Multi-Agent)',
        accelerationPct: 99.2,
        description: 'Bank statement parsing, KYC/AML sanction screening, and deterministic credit underwriting.',
        keyUseCases: ['100-Page PDF Underwriting in 14 mins', 'RBI Digital Lending Compliance', 'Real-time Sanctions & AML Screening', 'Dispute Dossier Assembly']
    },
    manufacturing: {
        id: 'manufacturing',
        name: 'Industrial Manufacturing',
        tag: 'Shopfloor & ERP',
        multiplier: 1.50,
        baselineTurnaround: '36 Hours (Vendor BOM & PO Variance)',
        elesiumTurnaround: '45 Seconds (ERP Event-Driven Agent)',
        accelerationPct: 97.9,
        description: 'SAP S/4HANA PO 3-way matching, BOM variance detection, and inventory stockout prevention.',
        keyUseCases: ['SAP S/4HANA RFC Automation', 'Shopfloor Downtime Root-Cause Detection', 'Vendor Invoice 3-Way Reconciliation', 'Real-time BOM Sync']
    },
    healthcare: {
        id: 'healthcare',
        name: 'Healthcare & Diagnostics',
        tag: 'Clinical & Claims',
        multiplier: 1.60,
        baselineTurnaround: '24 Hours (Prior-Auth Packet Review)',
        elesiumTurnaround: '3 Minutes (Air-Gapped Private VLM)',
        accelerationPct: 98.8,
        description: 'HIPAA & DPDP Act compliant medical records extraction and automated insurance claim disputes.',
        keyUseCases: ['DPDP Act 2023 Air-Gapped Deployment', 'Prior-Authorization Extraction', 'Diagnostic Report Structuring', 'Insurance Claim Dispute Resolution']
    },
    erp: {
        id: 'erp',
        name: 'Enterprise ERP & Back-Office',
        tag: 'Cross-System Sync',
        multiplier: 1.40,
        baselineTurnaround: '5 Business Days (Month-End Close)',
        elesiumTurnaround: 'Sub-2 Seconds (Event-Driven Data Mesh)',
        accelerationPct: 99.5,
        description: 'Zero manual data entry between Salesforce, Oracle NetSuite, SAP, and banking APIs.',
        keyUseCases: ['Multi-System Data Reconciliation', 'Month-End Financial Close Acceleration', 'Automated Exception Handling', 'Audit-Ready Ledger Trails']
    }
};

export interface CalculatorInputs {
    teamSize: number;
    monthlySalary: number;
    errorRate: number;
    industry: IndustryKey;
    currency: Currency;
}

export interface YearCostBreakdown {
    year: number;
    manualCost: number;
    legacySaaS: number;
    elesiumCost: number;
    netSavings: number;
}

export interface CalculatorOutputs {
    annualBasePayroll: number;
    errorReworkCost: number;
    manualAnnualSpend: number;
    manual3YearSpend: number;

    legacySaaSAnnualSpend: number;
    legacySaaS3YearSpend: number;

    elesiumPilotSetup: number;
    elesiumAnnualCompute: number;
    elesiumYear1Spend: number;
    elesiumOngoingSpend: number;
    elesium3YearSpend: number;

    netAnnualSavingsYear1: number;
    netAnnualSavingsOngoing: number;
    averageAnnualSavings: number;
    total3YearSavings: number;

    paybackPeriodMonths: number;
    roiMultiple3Year: string;
    annualHoursSaved: number;

    turnaroundAccelerationPct: number;
    baselineTurnaround: string;
    elesiumTurnaround: string;

    yearByYear: YearCostBreakdown[];
}

export function calculateEnterpriseRoi(inputs: CalculatorInputs): CalculatorOutputs {
    const { teamSize, monthlySalary, errorRate, industry, currency } = inputs;
    const config = INDUSTRY_CONFIGS[industry] || INDUSTRY_CONFIGS.logistics;

    // 1. Manual Base Cost & Error Overhead
    const annualBasePayroll = Math.max(0, teamSize * monthlySalary * 12);
    const errorReworkCost = Math.round(annualBasePayroll * (errorRate / 100) * config.multiplier);
    const manualAnnualSpend = annualBasePayroll + errorReworkCost;

    // 2. Legacy SaaS (Per-seat license + Integration drag + 45% manual staff retained)
    const perSeatRate = currency === 'INR' ? 7000 : 90;
    const integrationFixed = currency === 'INR' ? 450000 : 5500;
    const legacySaaSPerSeat = perSeatRate * teamSize * 12;
    const residualManualSaaS = Math.round(annualBasePayroll * 0.45);
    const legacySaaSAnnualSpend = legacySaaSPerSeat + integrationFixed + residualManualSaaS;

    // 3. Elesium Sovereign Private VPC Architecture
    // Pilot setup: Scaled predictably by team footprint
    const pilotBase = currency === 'INR' ? 350000 : 4500;
    const pilotPerSeat = currency === 'INR' ? 15000 : 200;
    const pilotCap = currency === 'INR' ? 1200000 : 15000;
    const elesiumPilotSetup = Math.min(pilotCap, Math.max(pilotBase, pilotBase + (teamSize - 5) * pilotPerSeat));

    // Sovereign VPC Compute & Token Ingestion:
    const computeBase = currency === 'INR' ? 150000 : 1800;
    const computePerSeat = currency === 'INR' ? 4000 : 50;
    const computeCap = currency === 'INR' ? 480000 : 6000;
    const elesiumAnnualCompute = Math.min(computeCap, computeBase + teamSize * computePerSeat);

    // Elesium automates 85% of volume, retaining 15% supervisory human-in-the-loop oversight
    const residualHumanElesium = Math.round(annualBasePayroll * 0.15);

    // Year 1: Pilot + Compute + Residual
    const elesiumYear1Spend = elesiumPilotSetup + elesiumAnnualCompute + residualHumanElesium;

    // Year 2 & 3: Retainer/SLA + Compute + Residual (NO pilot cost)
    const slaRetainer = currency === 'INR' ? 180000 : 2400;
    const elesiumOngoingSpend = elesiumAnnualCompute + slaRetainer + residualHumanElesium;

    // Net Savings
    const netAnnualSavingsYear1 = Math.max(0, manualAnnualSpend - elesiumYear1Spend);
    const netAnnualSavingsOngoing = Math.max(0, manualAnnualSpend - elesiumOngoingSpend);
    const averageAnnualSavings = Math.round((netAnnualSavingsYear1 + (netAnnualSavingsOngoing * 2)) / 3);

    // 3-Year Projections (Factoring 8% salary inflation for manual, 5% SaaS price hikes)
    const manualYear1 = manualAnnualSpend;
    const manualYear2 = Math.round(manualAnnualSpend * 1.08);
    const manualYear3 = Math.round(manualAnnualSpend * 1.1664);
    const manual3YearSpend = manualYear1 + manualYear2 + manualYear3;

    const saasYear1 = legacySaaSAnnualSpend;
    const saasYear2 = Math.round(legacySaaSAnnualSpend * 1.05);
    const saasYear3 = Math.round(legacySaaSAnnualSpend * 1.1025);
    const legacySaaS3YearSpend = saasYear1 + saasYear2 + saasYear3;

    const elesium3YearSpend = elesiumYear1Spend + (elesiumOngoingSpend * 2);
    const total3YearSavings = Math.max(0, manual3YearSpend - elesium3YearSpend);

    // Payback Period (Months)
    const monthlyNetRunRate = (manualAnnualSpend - elesiumOngoingSpend) / 12;
    const paybackPeriodMonths = monthlyNetRunRate > 0
        ? Math.max(0.8, Number((elesiumPilotSetup / monthlyNetRunRate).toFixed(1)))
        : 2.1;

    // 3-Year ROI Multiple on Direct Engineering Investment
    const directInvestment3Year = elesiumPilotSetup + (elesiumAnnualCompute * 3) + (slaRetainer * 2);
    const roiMultiple3Year = directInvestment3Year > 0
        ? (total3YearSavings / directInvestment3Year).toFixed(1)
        : '5.2';

    // Annual Productive Hours Recovered (1,800 working hours/yr * 85% automated)
    const annualHoursSaved = Math.round(teamSize * 1800 * 0.85);

    const yearByYear: YearCostBreakdown[] = [
        {
            year: 1,
            manualCost: manualYear1,
            legacySaaS: saasYear1,
            elesiumCost: elesiumYear1Spend,
            netSavings: netAnnualSavingsYear1
        },
        {
            year: 2,
            manualCost: manualYear2,
            legacySaaS: saasYear2,
            elesiumCost: elesiumOngoingSpend,
            netSavings: manualYear2 - elesiumOngoingSpend
        },
        {
            year: 3,
            manualCost: manualYear3,
            legacySaaS: saasYear3,
            elesiumCost: elesiumOngoingSpend,
            netSavings: manualYear3 - elesiumOngoingSpend
        }
    ];

    return {
        annualBasePayroll,
        errorReworkCost,
        manualAnnualSpend,
        manual3YearSpend,
        legacySaaSAnnualSpend,
        legacySaaS3YearSpend,
        elesiumPilotSetup,
        elesiumAnnualCompute,
        elesiumYear1Spend,
        elesiumOngoingSpend,
        elesium3YearSpend,
        netAnnualSavingsYear1,
        netAnnualSavingsOngoing,
        averageAnnualSavings,
        total3YearSavings,
        paybackPeriodMonths,
        roiMultiple3Year,
        annualHoursSaved,
        turnaroundAccelerationPct: config.accelerationPct,
        baselineTurnaround: config.baselineTurnaround,
        elesiumTurnaround: config.elesiumTurnaround,
        yearByYear
    };
}

export function formatCurrency(amount: number, currency: Currency, compact: boolean = false): string {
    if (isNaN(amount)) return currency === 'INR' ? '₹0' : '$0';

    if (currency === 'INR') {
        if (compact) {
            if (amount >= 10000000) {
                return `₹${(amount / 10000000).toFixed(2)} Cr`;
            } else if (amount >= 100000) {
                return `₹${(amount / 100000).toFixed(1)}L`;
            } else if (amount >= 1000) {
                return `₹${(amount / 1000).toFixed(0)}k`;
            }
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    } else {
        if (compact) {
            if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(2)}M`;
            } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(1)}k`;
            }
        }
        return `$${amount.toLocaleString('en-US')}`;
    }
}
