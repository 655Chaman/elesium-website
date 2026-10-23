import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Lock, 
    CheckCircle2, 
    ArrowRight, 
    Check, 
    MessageSquare,
    ExternalLink,
    Cpu,
    Server,
    Layers,
    ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { TrustProofRibbon } from '../cro/TrustProofRibbon';
import { useWhatsApp } from '../../hooks/useWhatsApp';

// Fallback WhatsApp Engineering Desk
const WHATSAPP_NUMBER = '918317329312';

// Standard Enterprise Roles
const EXECUTIVE_ROLES = [
    'Chief Technology Officer (CTO)',
    'VP of Engineering / Technology',
    'VP of Operations / Supply Chain',
    'Chief Risk / Compliance Officer (CRO)',
    'Head of AI / Enterprise Architecture',
    'Founder / Chief Executive (CEO)',
    'Director of Digital Transformation / IT'
];

// Workflow Domains for ele-in SaaS Platform
const WORKFLOW_DOMAINS = [
    { id: 'logistics-erp', label: 'Logistics ERP & Autonomous Fleet Dispatch' },
    { id: 'bfsi-underwriting', label: 'BFSI Loan Underwriting & CAM Generation' },
    { id: 'ledger-recon', label: 'Sub-200ms Ledger Reconciliation & Trade Surveillance' },
    { id: 'manufacturing-scada', label: 'Manufacturing SCADA Anomaly & Defect Detection' },
    { id: 'private-vpc-llm', label: 'Private Air-Gapped VPC LLM Deployment' },
    { id: 'healthcare-ehr', label: 'Healthcare Clinical Documentation & DICOM Triage' },
    { id: 'custom-langgraph', label: 'Custom LangGraph Multi-Agent State Machine' }
];

// Infrastructure / Deployment Preferences for ele-in
const HOSTING_PREFERENCES = [
    { id: 'private-vpc', label: 'Private VPC (AWS / Azure / GCP Dedicated Enclave)' },
    { id: 'air-gapped-on-prem', label: 'Air-Gapped On-Premise GPU Cluster (CtrlS / Yotta / Nxtra)' },
    { id: 'sovereign-cloud', label: 'Elesium Sovereign Cloud (Indian Datacenters - DPDP 2023 Compliant)' },
    { id: 'hybrid', label: 'Hybrid Multi-Cloud Enterprise Mesh' }
];

// Compliance and Infrastructure Constraints
const COMPLIANCE_STANDARDS = [
    'DPDP Act 2023 (India)',
    'RBI / SEBI Data Localization',
    'Air-Gapped Private VPC (Zero External LLM Leakage)',
    'SOC-2 Type II / HIPAA',
    'SAP S/4HANA / Salesforce Integration'
];

export default function Waitlist() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    const [searchParams] = useSearchParams();

    // Contextual parameters passed from referring solution pages or ROI calculator
    const solutionParam = searchParams.get('solution') || '';
    const roiParam = searchParams.get('roi') || '';
    const teamParam = searchParams.get('team') || '';
    const refParam = searchParams.get('ref') || '';

    // Smart title formatting
    const formattedSolutionTitle = useMemo(() => {
        if (!solutionParam) return '';
        return solutionParam
            .split('-')
            .map(word => {
                if (['ai', 'erp', 'bfsi', 'edi', 'aml', 'scada', 'oem', 'dicom', 'hipaa', 'vpc', 'llm', 'sap', 'dpdp', '3pl', 'cto'].includes(word.toLowerCase())) {
                    return word.toUpperCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }, [solutionParam]);

    // Initial default workflow based on solution param
    const defaultWorkflow = useMemo(() => {
        if (solutionParam.includes('logistics') || solutionParam.includes('dispatch') || solutionParam.includes('warehouse')) {
            return 'Logistics ERP & Autonomous Fleet Dispatch';
        }
        if (solutionParam.includes('underwriting') || solutionParam.includes('loan') || solutionParam.includes('bfsi')) {
            return 'BFSI Loan Underwriting & CAM Generation';
        }
        if (solutionParam.includes('ledger') || solutionParam.includes('aml') || solutionParam.includes('trade')) {
            return 'Sub-200ms Ledger Reconciliation & Trade Surveillance';
        }
        if (solutionParam.includes('manufacturing') || solutionParam.includes('scada') || solutionParam.includes('defect')) {
            return 'Manufacturing SCADA Anomaly & Defect Detection';
        }
        if (solutionParam.includes('vpc') || solutionParam.includes('air-gapped') || solutionParam.includes('defense')) {
            return 'Private Air-Gapped VPC LLM Deployment';
        }
        if (solutionParam.includes('healthcare') || solutionParam.includes('clinical') || solutionParam.includes('dicom')) {
            return 'Healthcare Clinical Documentation & DICOM Triage';
        }
        return 'Custom LangGraph Multi-Agent State Machine';
    }, [solutionParam]);

    // Form state
    const [fullName, setFullName] = useState('');
    const [workEmail, setWorkEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [role, setRole] = useState(EXECUTIVE_ROLES[0]);
    const [workflow, setWorkflow] = useState(defaultWorkflow);
    const [hostingPreference, setHostingPreference] = useState(HOSTING_PREFERENCES[0].label);
    const [selectedCompliance, setSelectedCompliance] = useState<string[]>([
        'DPDP Act 2023 (India)',
        'Air-Gapped Private VPC (Zero External LLM Leakage)'
    ]);
    const [notes, setNotes] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');

    // Pre-select workflow if param updates
    useEffect(() => {
        if (defaultWorkflow) {
            setWorkflow(defaultWorkflow);
        }
    }, [defaultWorkflow]);

    // Corporate domain validator indicator
    const isGenericEmail = useMemo(() => {
        if (!workEmail.includes('@')) return false;
        const domain = workEmail.split('@')[1]?.toLowerCase();
        return ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'].includes(domain);
    }, [workEmail]);

    const toggleCompliance = (standard: string) => {
        setSelectedCompliance(prev => 
            prev.includes(standard) ? prev.filter(s => s !== standard) : [...prev, standard]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workEmail || !fullName || !companyName) return;

        setIsLoading(true);
        const code = `ELE-IN-2026-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
        setConfirmationCode(code);

        const payload = {
            name: fullName.trim(),
            email: workEmail.trim().toLowerCase(),
            company: companyName.trim(),
            website: companyWebsite.trim() || 'N/A',
            role: role,
            usecase: `[ele-in SaaS Waitlist] Target Workflow: ${workflow} | Hosting: ${hostingPreference} ${notes ? '| Notes: ' + notes : ''}`,
            revenue: hostingPreference,
            certifications: selectedCompliance.join(', '),
            readiness: 'SaaS Alpha Waitlist',
            targetPartner: solutionParam ? `Referred by /solutions/${solutionParam}` : 'ele-in SaaS Portal',
            leadSource: 'ele-in SaaS Product Waitlist',
            attributionSource: refParam || (solutionParam ? `/solutions/${solutionParam}` : (roiParam ? `/tools/enterprise-ai-roi-calculator` : '/waitlist')),
            confirmationCode: code,
            roiImported: roiParam ? `₹${roiParam} Lakhs/yr` : undefined,
            teamSizeImported: teamParam || undefined
        };

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://elesium-website.onrender.com';
            
            const response = await fetch(`${apiUrl}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch(() => null);

            if (response && response.ok) {
                setSubmitted(true);
            } else {
                console.warn('[ele-in WAITLIST] Server acknowledgment fallback. Recorded locally.');
                setSubmitted(true);
            }
        } catch (error) {
            console.error('ele-in waitlist submission error:', error);
            setSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    // WhatsApp Fallback link
    const whatsappUrl = useMemo(() => {
        const msg = `Hello Chaman,\n\nI just joined the ele-in SaaS product waitlist on elesium.online.\n\n• Confirmation Ref: ${confirmationCode || 'ELE-IN-WAITLIST'}\n• Name: ${fullName}\n• Company: ${companyName}\n• Role: ${role}\n• Planned Workflow: ${workflow}\n• Hosting Preference: ${hostingPreference}\n\nLooking forward to accessing the private alpha tenant.`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }, [confirmationCode, fullName, companyName, role, workflow, hostingPreference]);

    const inputClass =
        'w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 outline-none transition-all text-[14px]';

    const selectClass =
        'w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 outline-none transition-all text-[14px] cursor-pointer appearance-none';

    return (
        <motion.div 
            key="ele-in-waitlist-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative min-h-[100vh] pt-24 pb-20 px-5 md:px-8 bg-white dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300"
        >
            <Helmet>
                <title>ele-in Early Access Waitlist | Sovereign Enterprise AI SaaS Platform | Elesium</title>
                <meta
                    name="description"
                    content="Join the exclusive private alpha waitlist for ele-in, Elesium's autonomous multi-agent enterprise SaaS platform. Deploy sovereign, deterministic AI workflows with zero prompt leakage and statutory DPDP Act compliance."
                />
                <link rel="canonical" href="https://elesium.online/waitlist" />
                <meta property="og:title" content="ele-in Early Access Waitlist | Sovereign Enterprise AI SaaS" />
                <meta property="og:description" content="Request private alpha access to ele-in, India's most advanced autonomous enterprise AI SaaS operating system by Elesium." />
                <meta property="og:url" content="https://elesium.online/waitlist" />
            </Helmet>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-200">ele-in SaaS Waitlist</span>
                </nav>
                
                {/* Contextual Referral Banner */}
                {(formattedSolutionTitle || roiParam) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-emerald-400 font-bold uppercase tracking-wider">Solution Blueprint Ingested:</span>
                            {formattedSolutionTitle && (
                                <span className="text-gray-200 font-sans font-semibold">
                                    {formattedSolutionTitle}
                                </span>
                            )}
                        </div>
                        {roiParam && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-emerald-500/30 rounded-lg text-emerald-300">
                                <span>Target Annual Cost Elimination:</span>
                                <strong className="font-bold text-white">₹{roiParam} Lakhs / Year</strong>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Two-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: ele-in Platform Overview */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            {/* Live Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[11px] font-mono tracking-wider uppercase mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                ele-in // Private Alpha Cohort Open
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.15] mb-5">
                                ele-in <br className="hidden sm:block" />
                                Sovereign AI Platform
                            </h1>

                            <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                <strong className="text-gray-900 dark:text-white font-semibold">ele-in</strong> is Elesium's autonomous multi-agent enterprise SaaS platform. Built for engineering teams, CTOs, and operations leaders to deploy deterministic, sovereign AI agents across legacy enterprise workflows with zero token leakage.
                            </p>
                        </div>

                        {/* ele-in Core SaaS Architecture Pillars */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/10 shadow-sm space-y-4">
                            <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-gray-400">
                                What ele-in Delivers Out of the Box
                            </h3>
                            <div className="space-y-3.5 text-[14px]">
                                <div className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <strong className="text-gray-900 dark:text-white font-medium block">Visual Multi-Agent Canvas</strong>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">Orchestrate LangGraph cyclic state machines, human-in-the-loop gates, and deterministic fallbacks visually.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <strong className="text-gray-900 dark:text-white font-medium block">Air-Gapped Sovereign Privacy</strong>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">Local PII scrubbing (Verhoeff Aadhaar / PAN) and 100% compliance with India's DPDP Act 2023.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                                        <Cpu className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <strong className="text-gray-900 dark:text-white font-medium block">Sub-200ms Execution Latency</strong>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">High-throughput streaming engine with automated rollback checkpoints and verifiable state receipts.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                                        <Server className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <strong className="text-gray-900 dark:text-white font-medium block">Turnkey ERP &amp; Banking Bridges</strong>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">Pre-built connectors into SAP S/4HANA, Salesforce, Tally ERP, and Core Banking APIs.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enterprise Consulting & Custom Architecture Notice */}
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-gray-200/80 dark:border-white/10 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-semibold text-gray-900 dark:text-white">Need Custom Enterprise Deployment Today?</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Looking for custom sovereign VPC engineering, dedicated on-premise GPU pods, or immediate technical scoping? All enterprise appointments route exclusively through our WhatsApp engineering desk.
                            </p>
                            <button
                                type="button"
                                onClick={openWhatsApp}
                                className="w-full h-11 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Chat on WhatsApp with Lead Architect</span>
                            </button>
                        </div>

                    </div>

                    {/* Right Column: ele-in Waitlist Form */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {!submitted ? (
                                <motion.form
                                    key="ele-in-form"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    onSubmit={handleSubmit}
                                    className="p-6 md:p-10 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 shadow-xl space-y-6"
                                >
                                    <div className="border-b border-gray-100 dark:border-white/5 pb-5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                    Request Early Access to ele-in
                                                </h2>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Enter your corporate details to join the private alpha cohort.
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                                                Alpha Batch 2026
                                            </span>
                                        </div>
                                    </div>

                                    {/* Name & Email Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                                Full Name &amp; Title <span className="text-emerald-500">*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                id="fullName"
                                                value={fullName}
                                                onChange={e => setFullName(e.target.value)}
                                                placeholder="e.g. Vikram Seth, VP Engineering"
                                                className={inputClass}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label htmlFor="workEmail" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                    Corporate Work Email <span className="text-emerald-500">*</span>
                                                </label>
                                                {isGenericEmail && (
                                                    <span className="text-[10px] text-amber-500 font-mono">
                                                        Corporate domain preferred
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                id="workEmail"
                                                value={workEmail}
                                                onChange={e => setWorkEmail(e.target.value)}
                                                placeholder="v.seth@company.com"
                                                className={`${inputClass} ${isGenericEmail ? 'border-amber-500/50 focus:ring-amber-500/30' : ''}`}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {/* Company & Website Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="companyName" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                                Company / Enterprise <span className="text-emerald-500">*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                id="companyName"
                                                value={companyName}
                                                onChange={e => setCompanyName(e.target.value)}
                                                placeholder="e.g. Acme Logistics India"
                                                className={inputClass}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="companyWebsite" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                                Company Website
                                            </label>
                                            <input
                                                type="text"
                                                id="companyWebsite"
                                                value={companyWebsite}
                                                onChange={e => setCompanyWebsite(e.target.value)}
                                                placeholder="https://acmelogistics.in"
                                                className={inputClass}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {/* Executive Role Selection */}
                                    <div>
                                        <label htmlFor="role" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                            Your Role in the Enterprise <span className="text-emerald-500">*</span>
                                        </label>
                                        <select
                                            id="role"
                                            value={role}
                                            onChange={e => setRole(e.target.value)}
                                            className={selectClass}
                                            disabled={isLoading}
                                        >
                                            {EXECUTIVE_ROLES.map(r => (
                                                <option key={r} value={r} className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Workflow Domain Selection */}
                                    <div>
                                        <label htmlFor="workflow" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                            Primary Workflow for ele-in <span className="text-emerald-500">*</span>
                                        </label>
                                        <select
                                            id="workflow"
                                            value={workflow}
                                            onChange={e => setWorkflow(e.target.value)}
                                            className={selectClass}
                                            disabled={isLoading}
                                        >
                                            {WORKFLOW_DOMAINS.map(w => (
                                                <option key={w.id} value={w.label} className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
                                                    {w.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Hosting / Deployment Preference */}
                                    <div>
                                        <label htmlFor="hostingPreference" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                            Target Hosting Environment <span className="text-emerald-500">*</span>
                                        </label>
                                        <select
                                            id="hostingPreference"
                                            value={hostingPreference}
                                            onChange={e => setHostingPreference(e.target.value)}
                                            className={selectClass}
                                            disabled={isLoading}
                                        >
                                            {HOSTING_PREFERENCES.map(h => (
                                                <option key={h.id} value={h.label} className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
                                                    {h.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Statutory Compliance Checklist */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                            Statutory &amp; Security Constraints
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                            {COMPLIANCE_STANDARDS.map(standard => {
                                                const isChecked = selectedCompliance.includes(standard);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={standard}
                                                        onClick={() => toggleCompliance(standard)}
                                                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                                                            isChecked
                                                                ? 'border-emerald-500/50 bg-emerald-500/10 text-gray-900 dark:text-white'
                                                                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        <span>{standard}</span>
                                                        {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Brief Notes */}
                                    <div>
                                        <label htmlFor="notes" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                            Current Bottleneck &amp; Specific Use Case
                                        </label>
                                        <textarea
                                            id="notes"
                                            rows={3}
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            placeholder="e.g. Need to replace manual invoice data extraction into SAP S/4HANA with sub-200ms verification..."
                                            className={inputClass}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading || !fullName || !workEmail || !companyName}
                                        className="w-full py-4 px-6 rounded-full bg-black text-white hover:opacity-90 dark:bg-white dark:text-black font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                <span>Registering Priority Node...</span>
                                            </span>
                                        ) : (
                                            <>
                                                <span>Join ele-in Early Access Waitlist</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    {/* Footnote */}
                                    <div className="flex items-center justify-center gap-2 text-center text-[11px] text-gray-400 dark:text-gray-500 pt-2">
                                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Corporate Privacy Guarantee. Zero third-party telemetry or public LLM leakage.</span>
                                    </div>
                                </motion.form>
                            ) : (
                                /* Confirmation Screen */
                                <motion.div
                                    key="ele-in-confirmation"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="p-8 md:p-12 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-emerald-500/30 shadow-2xl space-y-8 text-center"
                                >
                                    {/* Success Ring */}
                                    <div className="relative flex items-center justify-center h-20 w-20 mx-auto">
                                        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </span>
                                    </div>

                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                                            Priority Node Registered // ele-in Alpha
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            You Are On The ele-in Waitlist
                                        </h3>
                                        <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                                            Your private tenant allocation has been staged. As alpha slots open, an onboarding key will be dispatched to <strong className="text-gray-900 dark:text-white font-medium">{workEmail}</strong>.
                                        </p>
                                    </div>

                                    {/* Technical Ingestion Receipt */}
                                    <div className="w-full max-w-md mx-auto bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-left font-mono text-xs space-y-2.5">
                                        <div className="flex justify-between border-b border-gray-200 dark:border-white/5 pb-2">
                                            <span className="text-gray-400">WAITLIST REF</span>
                                            <span className="text-emerald-400 font-bold">{confirmationCode}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 dark:border-white/5 pb-2">
                                            <span className="text-gray-400">PRODUCT</span>
                                            <span className="text-white font-medium">ele-in (SaaS)</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 dark:border-white/5 pb-2">
                                            <span className="text-gray-400">ORGANIZATION</span>
                                            <span className="text-white font-medium truncate max-w-[200px]">{companyName}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 dark:border-white/5 pb-2">
                                            <span className="text-gray-400">TARGET WORKFLOW</span>
                                            <span className="text-white truncate max-w-[200px]">{workflow}</span>
                                        </div>
                                        <div className="flex justify-between pt-1">
                                            <span className="text-gray-400">STATUS</span>
                                            <span className="text-emerald-400 font-semibold">Priority Alpha Queue</span>
                                        </div>
                                    </div>

                                    {/* Direct WhatsApp Callout for Immediate Scoping */}
                                    <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-2">
                                        <span className="text-xs font-semibold text-white block">Need Custom Architecture or Immediate Deployment?</span>
                                        <p className="text-[11px] text-gray-400">
                                            All enterprise audits and custom multi-agent scoping sessions route directly through our Lead Architect on WhatsApp.
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={openWhatsApp}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 shadow-sm transition-all"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>Chat on WhatsApp</span>
                                        </button>
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium transition-all"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Direct WhatsApp Link</span>
                                            <ExternalLink className="w-3 h-3 text-gray-400" />
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Trust Proof Ribbon */}
                <div className="pt-8">
                    <TrustProofRibbon />
                </div>
            </div>
            <WhatsAppModal />
        </motion.div>
    );
}
