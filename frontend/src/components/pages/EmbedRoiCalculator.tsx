import { useState, useMemo } from 'react';
import { 
    DollarSign, 
    IndianRupee, 
    ArrowUpRight, 
    ShieldCheck, 
    Clock, 
    TrendingUp, 
    Zap 
} from 'lucide-react';
import { 
    calculateEnterpriseRoi, 
    formatCurrency, 
    INDUSTRY_CONFIGS, 
    Currency, 
    IndustryKey 
} from '../calculator/roiCalculatorModel';

export default function EmbedRoiCalculator() {
    const [currency, setCurrency] = useState<Currency>('INR');
    const [teamSize, setTeamSize] = useState<number>(25);
    const [monthlySalary, setMonthlySalary] = useState<number>(75000);
    const [errorRate, setErrorRate] = useState<number>(8);
    const [industry, setIndustry] = useState<IndustryKey>('logistics');

    // Handle currency switch
    const handleCurrencyChange = (newCurrency: Currency) => {
        if (newCurrency === currency) return;
        setCurrency(newCurrency);
        if (newCurrency === 'USD') {
            setMonthlySalary(2500);
        } else {
            setMonthlySalary(75000);
        }
    };

    const results = useMemo(() => {
        return calculateEnterpriseRoi({
            teamSize,
            monthlySalary,
            errorRate,
            industry,
            currency
        });
    }, [teamSize, monthlySalary, errorRate, industry, currency]);

    const activeIndustry = INDUSTRY_CONFIGS[industry];

    // Normalized max value for comparative bar graphs
    const maxBarSpend = Math.max(results.manualAnnualSpend, results.legacySaaSAnnualSpend, 1);
    const manualBarPct = 100;
    const saasBarPct = Math.min(100, Math.round((results.legacySaaSAnnualSpend / maxBarSpend) * 100));
    const elesiumBarPct = Math.min(100, Math.max(8, Math.round((results.elesiumYear1Spend / maxBarSpend) * 100)));

    return (
        <div className="w-full min-h-[600px] bg-slate-950 text-slate-100 p-4 md:p-6 font-sans antialiased flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Zap className="w-4 h-4" />
                    </div>
                    <div>
                        <h1 className="text-sm md:text-base font-semibold tracking-tight text-white flex items-center gap-2">
                            Enterprise AI ROI & TCO Engine
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                3-Year Model
                            </span>
                        </h1>
                        <p className="text-xs text-slate-400">Sovereign Private VPC vs Legacy SaaS & Manual Headcount Drag</p>
                    </div>
                </div>

                {/* Currency Switcher */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                    <button
                        type="button"
                        onClick={() => handleCurrencyChange('INR')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                            currency === 'INR'
                                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <IndianRupee className="w-3 h-3" />
                        INR (₹)
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCurrencyChange('USD')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                            currency === 'USD'
                                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <DollarSign className="w-3 h-3" />
                        USD ($)
                    </button>
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-4 my-auto">
                {/* Left Controls (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Industry Selector */}
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                            1. Industry Sector
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {(Object.keys(INDUSTRY_CONFIGS) as IndustryKey[]).map((key) => {
                                const ind = INDUSTRY_CONFIGS[key];
                                const isSelected = industry === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setIndustry(key)}
                                        className={`px-2.5 py-1.5 rounded-lg text-left text-xs transition-all border ${
                                            isSelected
                                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium'
                                                : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                        }`}
                                    >
                                        <div className="font-semibold truncate">{ind.name.split(' ')[0]}</div>
                                        <div className="text-[10px] text-slate-500 font-mono truncate">{ind.tag}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team Size Slider */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-medium">Team Footprint (Knowledge Workers)</span>
                            <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                                {teamSize} {teamSize === 1 ? 'employee' : 'employees'}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="500"
                            step="1"
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>1 member</span>
                            <span>100</span>
                            <span>250</span>
                            <span>500 members</span>
                        </div>
                    </div>

                    {/* Monthly Salary Slider */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-medium">Avg Monthly Salary / FTE</span>
                            <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                                {formatCurrency(monthlySalary, currency)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={currency === 'INR' ? 25000 : 500}
                            max={currency === 'INR' ? 500000 : 10000}
                            step={currency === 'INR' ? 5000 : 100}
                            value={monthlySalary}
                            onChange={(e) => setMonthlySalary(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>{currency === 'INR' ? '₹25k' : '$500'}</span>
                            <span>{currency === 'INR' ? '₹2.5L' : '$5k'}</span>
                            <span>{currency === 'INR' ? '₹5.0L' : '$10k'}</span>
                        </div>
                    </div>

                    {/* Error & Re-work Rate Slider */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-medium">Manual Operational Error Rate</span>
                            <span className="font-mono text-amber-400 font-bold text-sm bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
                                {errorRate}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="25"
                            step="1"
                            value={errorRate}
                            onChange={(e) => setErrorRate(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>1% (Precision)</span>
                            <span>12% (Standard)</span>
                            <span>25% (High Drag)</span>
                        </div>
                    </div>
                </div>

                {/* Right Results Dashboard (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* KPI 1: Net Annual Savings */}
                        <div className="bg-gradient-to-b from-emerald-950/60 to-slate-900/80 border border-emerald-500/30 rounded-xl p-3 relative overflow-hidden">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 mb-0.5 flex items-center justify-between">
                                Net Annual Savings
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight">
                                {formatCurrency(results.netAnnualSavingsYear1, currency, true)}
                            </div>
                            <div className="text-[10px] text-emerald-300/80 font-mono mt-0.5">
                                Year 1 Net Capital Freed
                            </div>
                        </div>

                        {/* KPI 2: Payback Period */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-0.5 flex items-center justify-between">
                                Payback Period
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                            <div className="text-xl md:text-2xl font-bold font-mono text-cyan-300 tracking-tight">
                                {results.paybackPeriodMonths} <span className="text-xs font-normal text-slate-400">Months</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                3-Year ROI: {results.roiMultiple3Year}x
                            </div>
                        </div>

                        {/* KPI 3: Turnaround Acceleration */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-0.5 flex items-center justify-between">
                                Latency Cut
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                            </div>
                            <div className="text-xl md:text-2xl font-bold font-mono text-indigo-300 tracking-tight">
                                {results.turnaroundAccelerationPct}%
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate" title={activeIndustry.elesiumTurnaround}>
                                {activeIndustry.elesiumTurnaround.split('(')[0]}
                            </div>
                        </div>
                    </div>

                    {/* Visual Comparison Breakdown Bars */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                        <div className="text-xs font-medium text-slate-300 uppercase tracking-wider font-mono flex justify-between items-center">
                            <span>Annual Total Cost of Ownership (TCO)</span>
                            <span className="text-[10px] text-slate-500 lowercase">normalized run-rate</span>
                        </div>

                        {/* Bar 1: Manual */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400">Current Manual Drag + Error Rework</span>
                                <span className="font-semibold text-rose-400">{formatCurrency(results.manualAnnualSpend, currency)}</span>
                            </div>
                            <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="bg-rose-500/80 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${manualBarPct}%` }}
                                />
                            </div>
                        </div>

                        {/* Bar 2: Legacy SaaS */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400">Legacy Off-the-Shelf SaaS (Per-Seat Tax)</span>
                                <span className="font-semibold text-amber-300">{formatCurrency(results.legacySaaSAnnualSpend, currency)}</span>
                            </div>
                            <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="bg-amber-500/80 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${saasBarPct}%` }}
                                />
                            </div>
                        </div>

                        {/* Bar 3: Elesium Sovereign VPC */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-emerald-400 font-medium">Elesium Sovereign VPC Multi-Agent</span>
                                <span className="font-bold text-emerald-400">{formatCurrency(results.elesiumYear1Spend, currency)}</span>
                            </div>
                            <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${elesiumBarPct}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operational Velocity Comparison */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl px-3 py-2 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="text-slate-400">
                            <span className="font-semibold text-slate-300">Turnaround Benchmark: </span>
                            <span className="line-through text-slate-500">{activeIndustry.baselineTurnaround}</span>
                            <span className="text-emerald-400 font-medium"> → {activeIndustry.elesiumTurnaround}</span>
                        </div>
                        <div className="text-[11px] font-mono text-cyan-400 whitespace-nowrap bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded">
                            {results.annualHoursSaved.toLocaleString()} hrs saved / yr
                        </div>
                    </div>

                    {/* Direct CTA Button */}
                    <a
                        href="https://elesium.online/waitlist"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs md:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200"
                    >
                        Schedule Architecture Audit to Lock These Savings
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Mandatory Clean Watermark Backlink */}
            <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'right', marginTop: '6px', fontFamily: 'sans-serif' }}>
                Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Elesium Enterprise AI Solutions</a>
            </div>
        </div>
    );
}
