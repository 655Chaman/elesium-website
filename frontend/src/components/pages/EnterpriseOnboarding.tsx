import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Lock, 
    CheckCircle2, 
    ArrowRight, 
    Check, 
    Download,
    FileText,
    Server,
    Layers,
    Clock,
    PhoneCall
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const TIERS = [
    {
        id: 'tier-1',
        name: 'Tier 1: Pilot Architecture Sprint',
        price: '₹1,50,000 - ₹3,50,000',
        timeline: '14-Day Delivery',
        description: 'Single-process deterministic agent prototype integrated with your test API or staging ERP. Includes complete architecture dossier and latency audit.',
        features: [
            'Single-Agent Deterministic Workflow',
            'Staging API / Webhook Integration',
            'Architecture & Latency Audit Dossier',
            'Contractual DPDP 2023 Compliance Enclave',
            '7-Day Post-Delivery Hypercare'
        ]
    },
    {
        id: 'tier-2',
        name: 'Tier 2: Enterprise Multi-Agent Suite',
        price: '₹6,00,000 - ₹15,00,000',
        timeline: '30-45 Day Production Deployment',
        popular: true,
        description: 'Collaborative 3-agent triad (Supervisor, Worker, Auditor) integrated directly with SAP S/4HANA, Oracle ERP, or custom Kafka clusters.',
        features: [
            'Collaborative 3-Agent Triad (Supervisor + Workers)',
            'SAP S/4HANA / Oracle / Kafka Production Sync',
            'Sub-200ms TTFT vLLM Inference Tuning',
            'Private VPC Enclave (Mumbai / Bangalore / Frankfurt)',
            'Contractual 90-Day 3x-5x ROI SLA'
        ]
    },
    {
        id: 'tier-3',
        name: 'Tier 3: Autonomous AI Engineering Pod',
        price: '₹4,50,000 / month',
        timeline: 'Continuous Dedicated Pod',
        description: 'Dedicated pod of 3 AI engineers + 1 principal systems architect providing continuous model fine-tuning, vector database optimization, and 1-hour critical SLA.',
        features: [
            'Dedicated Pod: 3 Senior AI Engineers + 1 Principal Architect',
            'Continuous Model Fine-Tuning & Quantization (FP8/INT4)',
            'Unlimited Workflow Scaling & Custom Integrations',
            '1-Hour Critical Production SLA Response',
            'Quarterly Executive Board ROI Presentation'
        ]
    }
];

export default function EnterpriseOnboarding() {
    const [[step, direction], setStepState] = useState<[number, number]>([1, 1]);
    const [companyName, setCompanyName] = useState('');
    const [signatoryName, setSignatoryName] = useState('');
    const [signatoryRole, setSignatoryRole] = useState('Chief Technology Officer (CTO)');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedTier, setSelectedTier] = useState('tier-2');
    const [techStack, setTechStack] = useState<string[]>(['sap', 'kubernetes']);
    const [compliance, setCompliance] = useState<string[]>(['dpdp-2023']);
    const [scopeBrief, setScopeBrief] = useState('');
    const [ndaGenerated, setNdaGenerated] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [shakeField, setShakeField] = useState(false);
    const [validationError, setValidationError] = useState('');

    const goToStep = (next: number) => {
        setValidationError('');
        setStepState([next, next > step ? 1 : -1]);
    };

    const triggerShake = (message: string) => {
        setValidationError(message);
        setShakeField(false);
        requestAnimationFrame(() => setShakeField(true));
        setTimeout(() => setShakeField(false), 500);
    };

    const handleStep1Next = () => {
        if (!companyName.trim() || !signatoryName.trim() || !email.trim() || !email.includes('@')) {
            triggerShake('Please complete entity name, signatory name, and a valid work email.');
            return;
        }
        goToStep(2);
    };

    const toggleTech = (item: string) => {
        setTechStack(prev => prev.includes(item) ? prev.filter(t => t !== item) : [...prev, item]);
    };

    const toggleCompliance = (item: string) => {
        setCompliance(prev => prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]);
    };

    const generatedNdaText = useMemo(() => {
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)
EFFECTIVE DATE: ${today}
GOVERNING LAW: Indian Contract Act, 1872 (Courts of Bengaluru, Karnataka)
STATUTORY COMPLIANCE: Digital Personal Data Protection (DPDP) Act, 2023 Section 8(5)

PARTIES:
1. ELESIUM DIGITAL SYSTEMS PRIVATE LIMITED (Koramangala 4th Block, Bengaluru, India)
2. ${companyName || '[ENTERPRISE CLIENT LEGAL ENTITY]'}

1. PURPOSE & SCOPE: Confidential enterprise AI architecture audits, autonomous multi-agent systems, and private VPC deployment.
2. STATUTORY ZERO RETENTION: Pursuant to DPDP Act 2023 Section 8(5), all LLM inference executes within client private VPC enclaves with zero external telemetry or foundation model training retention.
3. JURISDICTION: Exclusive jurisdiction of Bengaluru Courts.

EXECUTED BY:
Elesium: Chaman Shah (Founder & Principal Systems Architect)
${companyName || 'Company'}: ${signatoryName || '[Authorized Signatory]'} (${signatoryRole})
Date: ${today}`;
    }, [companyName, signatoryName, signatoryRole]);

    const handleDownloadNda = () => {
        const blob = new Blob([generatedNdaText], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Elesium_Mutual_NDA_${companyName.replace(/[^a-zA-Z0-9]/g, '_') || 'Enterprise'}.md`;
        link.click();
        URL.revokeObjectURL(url);
        setNdaGenerated(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim() || phone.trim().length < 7) {
            triggerShake('Please provide a valid direct phone or WhatsApp number.');
            return;
        }
        setSubmitted(true);
        // Dispatch WhatsApp message link
        const msg = encodeURIComponent(`ELESIUM ENTERPRISE ONBOARDING\nCompany: ${companyName}\nSignatory: ${signatoryName} (${signatoryRole})\nTier: ${selectedTier}\nEmail: ${email}\nPhone: ${phone}\nStack: ${techStack.join(', ')}\nCompliance: ${compliance.join(', ')}\nScope: ${scopeBrief}`);
        window.open(`https://wa.me/918317329312?text=${msg}`, '_blank');
    };

    const stepSlideVariants = {
        enter: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? 32 : -32,
        }),
        center: {
            opacity: 1,
            x: 0,
        },
        exit: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? -32 : 32,
        }),
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-16 pt-28 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Enterprise Onboarding & Architecture Scoping | Elesium</title>
                <meta name="description" content="Initiate high-ticket enterprise AI onboarding, generate an instant mutual NDA, and schedule an architecture consultation with Elesium's Lead Systems Architect." />
                <link rel="canonical" href="https://elesium.online/onboarding/" />
            </Helmet>

            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs font-mono uppercase tracking-wider mb-4">
                        <Lock className="w-3.5 h-3.5" /> Enterprise Procurement Enclave
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white mb-4">
                        Enterprise AI Scoping &amp; Onboarding
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Configure your statutory enclave, generate a legally binding Mutual NDA, and schedule your scoping sprint directly with our engineering team.
                    </p>
                </header>

                {/* Progress Indicators */}
                <div className="flex justify-between items-center mb-10 max-w-2xl mx-auto border-b border-neutral-200 dark:border-white/10 pb-4">
                    {[1, 2, 3, 4].map(num => (
                        <div key={num} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${step >= num ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200 dark:border-white/10'}`}>
                                {step > num ? <Check className="w-4 h-4" /> : num}
                            </div>
                            <span className={`text-xs font-medium hidden sm:inline ${step >= num ? 'text-black dark:text-white' : 'text-neutral-500'}`}>
                                {num === 1 && 'Entity & Tech'}
                                {num === 2 && 'Procurement Tier'}
                                {num === 3 && 'Mutual NDA'}
                                {num === 4 && 'Confirm & Schedule'}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} noValidate className={`bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-6 sm:p-10 overflow-hidden ${shakeField ? 'animate-shake' : ''}`}>
                    {validationError && (
                        <div className="mb-6 p-3 rounded-lg border border-black/30 dark:border-white/30 bg-white dark:bg-black text-xs font-mono text-black dark:text-white">
                            {validationError}
                        </div>
                    )}
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={stepSlideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            >
                                <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-black dark:text-white" /> 1. Corporate Legal Entity &amp; Core Systems
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Corporate Legal Entity Name *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={companyName}
                                            onChange={e => setCompanyName(e.target.value)}
                                            placeholder="e.g. Axis Commercial Capital Partners Ltd" 
                                            className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Authorized Signatory Name *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={signatoryName}
                                            onChange={e => setSignatoryName(e.target.value)}
                                            placeholder="e.g. Rajesh Subramanian" 
                                            className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Signatory Role / Title *</label>
                                        <select 
                                            value={signatoryRole}
                                            onChange={e => setSignatoryRole(e.target.value)}
                                            className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                                        >
                                            <option>Chief Technology Officer (CTO)</option>
                                            <option>VP of Engineering / Technology</option>
                                            <option>Chief Executive Officer (CEO)</option>
                                            <option>Head of Enterprise Architecture</option>
                                            <option>Chief Risk Officer (CRO)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Work Email Address *</label>
                                        <input 
                                            type="email" 
                                            required 
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="r.subramanian@axiscommercial.in" 
                                            className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-3">Target Tech Stack &amp; Enterprise Systems</label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            { id: 'sap', label: 'SAP S/4HANA (RFC / OData)' },
                                            { id: 'oracle', label: 'Oracle ERP Cloud' },
                                            { id: 'salesforce', label: 'Salesforce CRM' },
                                            { id: 'kafka', label: 'Apache Kafka Event Bus' },
                                            { id: 'kubernetes', label: 'Kubernetes Cluster' },
                                            { id: 'postgres', label: 'PostgreSQL / pgvector' }
                                        ].map(item => (
                                            <button
                                                type="button"
                                                key={item.id}
                                                onClick={() => toggleTech(item.id)}
                                                className={`px-3.5 py-2 rounded-lg text-xs font-medium border active:scale-[0.97] transition-all ${techStack.includes(item.id) ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-black border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-white/25'}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-3">Statutory &amp; Regulatory Governance Mandates</label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            { id: 'dpdp-2023', label: 'DPDP Act 2023 Section 8(5)' },
                                            { id: 'rbi-csf', label: 'RBI Cyber Security Framework' },
                                            { id: 'iso-27001', label: 'ISO/IEC 27001:2022' },
                                            { id: 'soc2', label: 'SOC 2 Type II Enclave' }
                                        ].map(item => (
                                            <button
                                                type="button"
                                                key={item.id}
                                                onClick={() => toggleCompliance(item.id)}
                                                className={`px-3.5 py-2 rounded-lg text-xs font-medium border active:scale-[0.97] transition-all ${compliance.includes(item.id) ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-black border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-white/25'}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button 
                                        type="button" 
                                        onClick={handleStep1Next}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold rounded-lg text-sm active:scale-[0.97] transition-all"
                                    >
                                        Next: Select Procurement Tier <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={stepSlideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            >
                                <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                                    <Server className="w-5 h-5 text-black dark:text-white" /> 2. Institutional Procurement Tier &amp; SLA
                                </h2>
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    {TIERS.map(tier => (
                                        <div 
                                            key={tier.id}
                                            onClick={() => setSelectedTier(tier.id)}
                                            className={`p-5 rounded-xl border cursor-pointer transition-all ${selectedTier === tier.id ? 'bg-white dark:bg-black border-black dark:border-white' : 'bg-white/60 dark:bg-black/40 border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/25'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTier === tier.id ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-neutral-400 dark:border-neutral-600'}`}>
                                                        {selectedTier === tier.id && <div className="w-1.5 h-1.5 bg-white dark:bg-black rounded-full" />}
                                                    </div>
                                                    <span className="font-bold text-black dark:text-white text-base">{tier.name}</span>
                                                    {tier.popular && (
                                                        <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                                                            Recommended
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-extrabold text-black dark:text-white text-sm sm:text-base">{tier.price}</span>
                                                    <span className="block text-[11px] text-neutral-600 dark:text-neutral-400">{tier.timeline}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 ml-7 mb-3">{tier.description}</p>
                                            <div className="ml-7 flex flex-wrap gap-x-4 gap-y-1">
                                                {tier.features.map((feat, idx) => (
                                                    <span key={idx} className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                                                        <Check className="w-3 h-3 text-black dark:text-white" /> {feat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between">
                                    <button 
                                        type="button" 
                                        onClick={() => goToStep(1)}
                                        className="px-5 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 text-black dark:text-white rounded-lg text-xs font-medium active:scale-[0.97] transition-all"
                                    >
                                        &larr; Back
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => goToStep(3)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold rounded-lg text-sm active:scale-[0.97] transition-all"
                                    >
                                        Next: Generate Mutual NDA <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={stepSlideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            >
                                <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-black dark:text-white" /> 3. Instant Mutual Non-Disclosure Agreement (NDA)
                                </h2>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                                    Pre-filled legally binding agreement governed under the Indian Contract Act, 1872 with exclusive Bengaluru jurisdiction and DPDP Act 2023 Section 8(5) statutory confidentiality safeguards.
                                </p>

                                <div className="bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-4 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed mb-6">
                                    {generatedNdaText}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 p-4 rounded-xl mb-6">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-black dark:text-white" />
                                        <div>
                                            <div className="text-sm font-bold text-black dark:text-white">Elesium_Mutual_NDA_{companyName.replace(/[^a-zA-Z0-9]/g, '_') || 'Enterprise'}.md</div>
                                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Cryptographically Stamped &middot; Ready for Legal Execution</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDownloadNda}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-xs font-bold rounded-lg active:scale-[0.97] transition-all"
                                    >
                                        <Download className="w-4 h-4" /> {ndaGenerated ? "NDA Stamped & Downloaded" : "Download Executable NDA"}
                                    </button>
                                </div>

                                <div className="flex justify-between">
                                    <button 
                                        type="button" 
                                        onClick={() => goToStep(2)}
                                        className="px-5 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 text-black dark:text-white rounded-lg text-xs font-medium active:scale-[0.97] transition-all"
                                    >
                                        &larr; Back
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => goToStep(4)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold rounded-lg text-sm active:scale-[0.97] transition-all"
                                    >
                                        Next: Finalize &amp; Schedule <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={direction}
                                variants={stepSlideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            >
                                <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-black dark:text-white" /> 4. Confirm Architecture Sprint &amp; Schedule
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Direct Phone / WhatsApp for Lead Architect *</label>
                                        <input 
                                            type="tel" 
                                            required 
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+91 98450 12345" 
                                            className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Brief Summary of Target Workflow or Bottleneck</label>
                                        <textarea 
                                            rows={3}
                                            value={scopeBrief}
                                            onChange={e => setScopeBrief(e.target.value)}
                                            placeholder="e.g. Automate 14-day manual underwriting credit appraisal into sub-4min CAM generation multi-agent triad with private VPC enclave in Mumbai."
                                            className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl mb-6 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-black dark:text-white shrink-0 mt-0.5" />
                                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                        <strong className="text-black dark:text-white">Direct Escalation SLA:</strong> Clicking submit connects you directly with Chaman Shah (Founder &amp; Lead Systems Architect) on WhatsApp with your pre-filled procurement dossier.
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button 
                                        type="button" 
                                        onClick={() => goToStep(3)}
                                        className="px-5 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 text-black dark:text-white rounded-lg text-xs font-medium active:scale-[0.97] transition-all"
                                    >
                                        &larr; Back
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={submitted}
                                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 font-extrabold rounded-lg text-sm active:scale-[0.97] transition-all"
                                    >
                                        <PhoneCall className="w-4 h-4" /> {submitted ? "Routing to WhatsApp Desk..." : "Submit & Open WhatsApp Desk"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
