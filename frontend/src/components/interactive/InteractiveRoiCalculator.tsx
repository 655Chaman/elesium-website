import React, { useState, useMemo } from 'react';
import { 
    TrendingUp, 
    Clock, 
    DollarSign, 
    IndianRupee, 
    Download, 
    Sparkles
} from 'lucide-react';

interface RoiCalculatorProps {
    defaultCurrency?: 'INR' | 'USD';
    onTelemetry?: (action: string, metadata?: Record<string, unknown>) => void;
}

export const InteractiveRoiCalculator: React.FC<RoiCalculatorProps> = ({
    defaultCurrency = 'INR',
    onTelemetry
}) => {
    const [currency, setCurrency] = useState<'INR' | 'USD'>(defaultCurrency);
    const [teamSize, setTeamSize] = useState<number>(15);
    const [hourlyRate, setHourlyRate] = useState<number>(currency === 'INR' ? 1400 : 65);
    const [repetitiveHoursPerWeek, setRepetitiveHoursPerWeek] = useState<number>(18);
    const [automationEfficiency, setAutomationEfficiency] = useState<number>(85); // percent
    const [setupCost, setSetupCost] = useState<number>(currency === 'INR' ? 1200000 : 25000);

    // Apply industry presets
    const applyPreset = (preset: 'bfsi' | 'manufacturing' | 'saas') => {
        if (preset === 'bfsi') {
            setTeamSize(18);
            setHourlyRate(currency === 'INR' ? 1500 : 70);
            setRepetitiveHoursPerWeek(22);
            setAutomationEfficiency(85);
            setSetupCost(currency === 'INR' ? 1400000 : 28000);
        } else if (preset === 'manufacturing') {
            setTeamSize(12);
            setHourlyRate(currency === 'INR' ? 1800 : 85);
            setRepetitiveHoursPerWeek(16);
            setAutomationEfficiency(80);
            setSetupCost(currency === 'INR' ? 1800000 : 35000);
        } else {
            setTeamSize(25);
            setHourlyRate(currency === 'INR' ? 2200 : 110);
            setRepetitiveHoursPerWeek(14);
            setAutomationEfficiency(90);
            setSetupCost(currency === 'INR' ? 2400000 : 45000);
        }

        onTelemetry?.('roi_preset_applied', { preset, currency });
    };

    // Calculate core financial metrics
    const stats = useMemo(() => {
        const weeksPerYear = 48; // accounting for PTO/holidays
        const totalManualHoursPerYear = teamSize * repetitiveHoursPerWeek * weeksPerYear;
        const totalAnnualLaborCost = totalManualHoursPerYear * hourlyRate;
        
        const reclaimedHoursAnnual = Math.round(totalManualHoursPerYear * (automationEfficiency / 100));
        const annualGrossSavings = Math.round(totalAnnualLaborCost * (automationEfficiency / 100));
        
        // Ongoing maintenance/cloud costs estimated at 12% of setup cost annually
        const annualMaintenance = Math.round(setupCost * 0.12);
        const annualNetSavings = annualGrossSavings - annualMaintenance;
        
        // Payback period in months
        const monthlyGrossSavings = annualGrossSavings / 12;
        const paybackMonths = monthlyGrossSavings > 0 
            ? Math.max(0.2, Number((setupCost / monthlyGrossSavings).toFixed(1)))
            : 0;

        // 3-Year ROI %
        const threeYearGrossSavings = annualGrossSavings * 3;
        const threeYearCost = setupCost + (annualMaintenance * 3);
        const threeYearRoiPercent = threeYearCost > 0
            ? Math.round(((threeYearGrossSavings - threeYearCost) / threeYearCost) * 100)
            : 0;

        return {
            totalManualHoursPerYear,
            totalAnnualLaborCost,
            reclaimedHoursAnnual,
            annualGrossSavings,
            annualNetSavings,
            paybackMonths,
            threeYearRoiPercent
        };
    }, [teamSize, hourlyRate, repetitiveHoursPerWeek, automationEfficiency, setupCost]);

    const formatCurrency = (val: number) => {
        if (currency === 'INR') {
            if (val >= 10000000) {
                return `₹${(val / 10000000).toFixed(2)} Cr`;
            } else if (val >= 100000) {
                return `₹${(val / 100000).toFixed(2)} Lakhs`;
            }
            return `₹${val.toLocaleString('en-IN')}`;
        } else {
            if (val >= 1000000) {
                return `$${(val / 1000000).toFixed(2)}M`;
            } else if (val >= 1000) {
                return `$${(val / 1000).toFixed(1)}k`;
            }
            return `$${val.toLocaleString('en-US')}`;
        }
    };

    const handleDownloadSummary = () => {
        const content = `ELESIUM ONLINE — ENTERPRISE AI ROI FINANCIAL AUDIT\n`
            + `Generated on: ${new Date().toLocaleDateString()}\n`
            + `--------------------------------------------------------\n`
            + `Team Size: ${teamSize} Knowledge Workers\n`
            + `Hourly Fully Loaded Rate: ${currency === 'INR' ? '₹' : '$'}${hourlyRate}/hr\n`
            + `Repetitive Hours / Week / Person: ${repetitiveHoursPerWeek} hrs\n`
            + `Target Automation Efficiency: ${automationEfficiency}%\n`
            + `Initial Architecture Investment: ${formatCurrency(setupCost)}\n\n`
            + `PROJECTION RESULTS:\n`
            + `Annual Hours Reclaimed: ${stats.reclaimedHoursAnnual.toLocaleString()} hours\n`
            + `Gross Annual Cost Savings: ${formatCurrency(stats.annualGrossSavings)}\n`
            + `Net Annual Cost Savings: ${formatCurrency(stats.annualNetSavings)}\n`
            + `Payback Breakeven Period: ${stats.paybackMonths} Months\n`
            + `3-Year Net Return (ROI): ${stats.threeYearRoiPercent}%\n`
            + `--------------------------------------------------------\n`
            + `Deploy private deterministic multi-agent state machines at elesium.online`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Elesium_Enterprise_ROI_Model_${teamSize}FTEs.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onTelemetry?.('roi_summary_downloaded', { stats, teamSize, currency });
    };

    return (
        <div className="interactive-asset my-12 p-6 md:p-8 rounded-2xl bg-gradient-to-b from-gray-950 via-[#070b12] to-black border border-blue-500/30 shadow-2xl text-white font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Deterministic Financial Modeler
                        </span>
                        <span className="text-xs text-white/50 font-mono">
                            Based on 90-Day Production Audits
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        Enterprise AI Automation ROI Calculator
                    </h3>
                </div>

                {/* Currency and Presets */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    {/* Currency Toggle */}
                    <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => {
                                setCurrency('INR');
                                setHourlyRate(1400);
                                setSetupCost(1200000);
                                onTelemetry?.('roi_currency_changed', { currency: 'INR' });
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                currency === 'INR'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <IndianRupee className="h-3 w-3" />
                            INR (₹)
                        </button>
                        <button
                            onClick={() => {
                                setCurrency('USD');
                                setHourlyRate(65);
                                setSetupCost(25000);
                                onTelemetry?.('roi_currency_changed', { currency: 'USD' });
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                currency === 'USD'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <DollarSign className="h-3 w-3" />
                            USD ($)
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Industry Presets */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-xs font-mono text-white/40 mr-1">Load Architecture Baseline:</span>
                <button
                    onClick={() => applyPreset('bfsi')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
                >
                    BFSI Credit Memo (18 FTEs)
                </button>
                <button
                    onClick={() => applyPreset('manufacturing')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
                >
                    Manufacturing ERP / SAP (12 FTEs)
                </button>
                <button
                    onClick={() => applyPreset('saas')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
                >
                    Enterprise Sales Ops (25 FTEs)
                </button>
            </div>

            {/* Main Interactive Grid: Sliders vs Outcome Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sliders Column */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Slider 1: Team Size */}
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-sm font-semibold mb-2">
                            <span className="text-white/80">Team Size (Analyst / Operations FTEs)</span>
                            <span className="font-mono text-blue-400 font-bold">{teamSize} Engineers / Analysts</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="80"
                            step="1"
                            value={teamSize}
                            onChange={(e) => {
                                setTeamSize(Number(e.target.value));
                                onTelemetry?.('roi_slider_team_size', { value: Number(e.target.value) });
                            }}
                            className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                            <span>2 FTEs (Lean Squad)</span>
                            <span>80 FTEs (Enterprise Division)</span>
                        </div>
                    </div>

                    {/* Slider 2: Hourly Rate */}
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-sm font-semibold mb-2">
                            <span className="text-white/80">Fully Loaded Hourly Labor Cost</span>
                            <span className="font-mono text-blue-400 font-bold">
                                {currency === 'INR' ? `₹${hourlyRate.toLocaleString()}/hr` : `$${hourlyRate}/hr`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={currency === 'INR' ? 600 : 25}
                            max={currency === 'INR' ? 6000 : 200}
                            step={currency === 'INR' ? 100 : 5}
                            value={hourlyRate}
                            onChange={(e) => {
                                setHourlyRate(Number(e.target.value));
                                onTelemetry?.('roi_slider_rate', { value: Number(e.target.value) });
                            }}
                            className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                            <span>{currency === 'INR' ? '₹600/hr (Mid-tier)' : '$25/hr (Offshore)'}</span>
                            <span>{currency === 'INR' ? '₹6,000/hr (Senior PM/Risk)' : '$200/hr (Senior US/EU)'}</span>
                        </div>
                    </div>

                    {/* Slider 3: Repetitive Hours */}
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-sm font-semibold mb-2">
                            <span className="text-white/80">Manual / Repetitive Hours per Week per FTE</span>
                            <span className="font-mono text-blue-400 font-bold">{repetitiveHoursPerWeek} hrs / week</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="35"
                            step="1"
                            value={repetitiveHoursPerWeek}
                            onChange={(e) => {
                                setRepetitiveHoursPerWeek(Number(e.target.value));
                                onTelemetry?.('roi_slider_hours', { value: Number(e.target.value) });
                            }}
                            className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                            <span>5 hrs (Low manual drag)</span>
                            <span>35 hrs (Heavy data entry / reconciliation)</span>
                        </div>
                    </div>

                    {/* Slider 4: Automation Efficiency */}
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-sm font-semibold mb-2">
                            <span className="text-white/80">Target Workflow Automation Rate</span>
                            <span className="font-mono text-emerald-400 font-bold">{automationEfficiency}% Automated</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="95"
                            step="5"
                            value={automationEfficiency}
                            onChange={(e) => {
                                setAutomationEfficiency(Number(e.target.value));
                                onTelemetry?.('roi_slider_efficiency', { value: Number(e.target.value) });
                            }}
                            className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                            <span>50% (Assisted Copilot)</span>
                            <span>95% (Autonomous State Machine)</span>
                        </div>
                    </div>
                </div>

                {/* KPI Breakdown Column */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    {/* Primary Highlight Card: Annual Savings */}
                    <div className="bg-gradient-to-br from-blue-950/40 via-blue-900/10 to-black p-6 rounded-2xl border border-blue-500/40 shadow-xl relative overflow-hidden">
                        <div className="text-xs font-mono text-blue-300 uppercase tracking-wider mb-1">
                            Net Annual Cost Reclaimed
                        </div>
                        <div className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
                            {formatCurrency(stats.annualNetSavings)}
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed mb-4">
                            Direct labor hours redirected into high-margin enterprise growth.
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                            <div>
                                <div className="text-[10px] font-mono text-white/40">Payback Breakeven</div>
                                <div className="text-lg font-bold text-emerald-400 font-mono">
                                    {stats.paybackMonths} Months
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-white/40">3-Year Net ROI</div>
                                <div className="text-lg font-bold text-cyan-400 font-mono">
                                    +{stats.threeYearRoiPercent}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Stat: Hours Reclaimed */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl">
                            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-1">
                                <Clock className="h-3.5 w-3.5 text-blue-400" />
                                <span>Hours Reclaimed</span>
                            </div>
                            <div className="text-xl font-bold font-mono text-white">
                                {stats.reclaimedHoursAnnual.toLocaleString()} hrs
                            </div>
                            <div className="text-[10px] text-white/40 mt-1">per year across squad</div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl">
                            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-1">
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Throughput Speed</span>
                            </div>
                            <div className="text-xl font-bold font-mono text-white">
                                {(1 / (1 - (automationEfficiency / 100))).toFixed(1)}x
                            </div>
                            <div className="text-[10px] text-white/40 mt-1">capacity acceleration</div>
                        </div>
                    </div>

                    {/* Export Action */}
                    <button
                        onClick={handleDownloadSummary}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-blue-600/25 active:scale-95"
                    >
                        <Download className="h-4 w-4" />
                        Export Financial Audit Brief (.txt)
                    </button>
                </div>
            </div>
        </div>
    );
};
