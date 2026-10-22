import { useState, FormEvent, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Loader2, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    ShieldCheck, 
    Lock, 
    Calendar, 
    Clock, 
    Cpu, 
    Check, 
    FileText 
} from 'lucide-react'
import { validateEnterpriseEmail, DomainValidationResult } from '../cro/corporateDomainValidator'
import { CalendarBookingEmbed } from '../cro/CalendarBookingEmbed'

// ─── Step indicators ──────────────────────────────────────────────────────────

const STEPS = [
    { num: '01', label: 'Identity' },
    { num: '02', label: 'Perimeter' },
    { num: '03', label: 'Dossier' },
]

// ─── Left panel copy per step ─────────────────────────────────────────────────

const LEFT_PANEL = [
    {
        badge: 'Sovereign Architecture Intake',
        heading: 'Direct Principal Engagement.',
        body: 'Elesium engineers bespoke, deterministic multi-agent systems and air-gapped LLM clusters for tier-1 enterprises. Zero third-party data telemetry, full statutory data residency.',
    },
    {
        badge: 'Infrastructure & Compliance',
        heading: 'Define Your Technical Perimeter.',
        body: 'Specify your target GPU compute environment, statutory compliance boundary, and latency tolerances. We tailor our LangGraph state machines directly to your technical perimeter.',
    },
    {
        badge: 'Executive Dossier',
        heading: 'Lock Your Architecture Review.',
        body: 'Directly reviewed by Chaman Shah (Principal AI Systems Architect). Receive a preliminary LangGraph DAG state machine topology, hardware sizing model, and TCO projection within 4 hours.',
    },
]

// ─── Deployment Targets & Compliance Frameworks ───────────────────────────────

const DEPLOYMENT_TARGETS = [
    { id: 'private-vpc', label: 'Private Air-Gapped VPC (AWS / GCP / Azure)' },
    { id: 'onprem-gpu', label: 'On-Premise GPU Cluster (NVIDIA HGX H100 / B200)' },
    { id: 'hybrid-sovereign', label: 'Hybrid Sovereign Cloud (Local Inference + Cloud)' },
    { id: 'bare-metal', label: 'Bare Metal Linux / Slurm HPC Environment' }
]

const COMPLIANCE_OPTIONS = [
    'DPDP Act 2023 (India Data Localization)',
    'RBI Cyber Security Framework & Master Direction',
    'SEBI Algorithmic Trading & Trade Surveillance',
    'SOC-2 Type II / ISO 27001 Statutories',
    'HIPAA / US FDA 21 CFR Part 11'
]

const CONCURRENCY_OPTIONS = [
    { id: 'low-latency', label: 'Sub-50ms Ultra-Low Latency (Financial Ledger / Voice)' },
    { id: 'high-concurrency', label: 'High-Concurrency Prefill/Decode (1,000+ Tokens/sec)' },
    { id: 'batch-document', label: 'Batch Document & Multimodal OCR (10,000+ Invoices/day)' },
    { id: 'scada-iot', label: 'Real-Time SCADA & Industrial IoT Sensor Stream' }
]

// ─── Form data type ───────────────────────────────────────────────────────────

type DossierFormData = {
    email: string
    website: string
    deploymentTarget: string
    complianceMatrix: string[]
    concurrencyEnvelope: string
    name: string
    company: string
    role: string
    targetWorkflow: string
    attributionSource: string
    leadSource: string
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-[15px]'

const selectClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-[15px] cursor-pointer appearance-none'

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'

// ─── Main export & Backward-Compatible Aliases ────────────────────────────────

export interface MandateApplicationFormProps {
    source?: string
    initialTab?: 'fast-track' | 'dossier'
}

export function WaitingListForm(props: MandateApplicationFormProps) {
    return <MandateApplicationForm {...props} />
}

export function MandateApplicationForm({ 
    source = 'enterprise-architecture-intake',
    initialTab = 'fast-track'
}: MandateApplicationFormProps) {
    const [activeTab, setActiveTab] = useState<'fast-track' | 'dossier'>(initialTab)
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [formData, setFormData] = useState<DossierFormData>({
        email: '',
        website: '',
        deploymentTarget: DEPLOYMENT_TARGETS[0].label,
        complianceMatrix: ['DPDP Act 2023 (India Data Localization)'],
        concurrencyEnvelope: CONCURRENCY_OPTIONS[0].label,
        name: '',
        company: '',
        role: '',
        targetWorkflow: '',
        attributionSource: '',
        leadSource: source,
    })

    // Corporate domain validation status
    const emailValidation: DomainValidationResult | null = useMemo(() => {
        if (!formData.email || formData.email.length < 4) return null
        return validateEnterpriseEmail(formData.email)
    }, [formData.email])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const toggleCompliance = (standard: string) => {
        setFormData(prev => ({
            ...prev,
            complianceMatrix: prev.complianceMatrix.includes(standard)
                ? prev.complianceMatrix.filter(s => s !== standard)
                : [...prev.complianceMatrix, standard]
        }))
    }

    const next = (e: FormEvent) => {
        e.preventDefault()
        setStep(s => Math.min(s + 1, 3))
    }

    const back = () => setStep(s => Math.max(s - 1, 1))

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const dossierCode = `ELS-ARCH-${Date.now().toString(36).toUpperCase()}`

        const submissionPayload = {
            ...formData,
            dossierCode,
            submittedAt: new Date().toISOString(),
            priorityScore: emailValidation?.priorityScore || 80
        }

        // Cache submission locally for robust offline recovery
        try {
            const existing = JSON.parse(localStorage.getItem('els_architecture_dossiers') || '[]')
            existing.push(submissionPayload)
            localStorage.setItem('els_architecture_dossiers', JSON.stringify(existing))
        } catch {
            // Local storage error ignored
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://elesium-website.onrender.com'
            
            await fetch(`${apiUrl}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionPayload),
            }).catch(() => null)

            // Resilient UX: always present the confirmed architecture dossier
            setIsLoading(false)
            setIsSuccess(true)
        } catch {
            setIsLoading(false)
            setIsSuccess(true)
        }
    }

    // ── Success state ──────────────────────────────────────────────────────────
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-10 animate-in fade-in duration-500 bg-white dark:bg-black font-sans">
                {/* Pulsing Success Ring */}
                <div className="relative flex items-center justify-center h-20 w-20 mb-6">
                    <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-emerald-500/20 opacity-75" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
                        <CheckCircle2 className="h-7 w-7" />
                    </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[11px] font-mono tracking-wider uppercase mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Architecture Dossier Ingested
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3 dark:text-white tracking-tight leading-snug">
                    Sovereign Engineering Review Under Way.
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 max-w-md text-sm leading-relaxed mb-6">
                    Your infrastructure requirements have been queued for direct evaluation by <strong className="text-gray-900 dark:text-white">Chaman Shah (Principal AI Systems Architect)</strong>. A preliminary LangGraph DAG state machine topology and TCO projection will be dispatched to <span className="font-mono text-emerald-600 dark:text-emerald-400">{formData.email}</span> within 4 hours.
                </p>

                {/* Dashboard summary widget of ingestion */}
                <div className="w-full max-w-md bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-left font-mono text-xs space-y-2.5 mb-6">
                    <div className="flex justify-between border-b border-gray-200/60 dark:border-white/5 pb-2">
                        <span className="text-gray-400">STATUS</span>
                        <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            PRINCIPAL DISPATCH ACTIVE
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 dark:border-white/5 pb-2">
                        <span className="text-gray-400">ORGANIZATION</span>
                        <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{formData.company || 'Enterprise Partner'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 dark:border-white/5 pb-2">
                        <span className="text-gray-400">DEPLOYMENT PERIMETER</span>
                        <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{formData.deploymentTarget}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 dark:border-white/5 pb-2">
                        <span className="text-gray-400">COMPLIANCE MATRIX</span>
                        <span className="text-gray-900 dark:text-white font-mono text-[11px]">
                            {formData.complianceMatrix.length} Frameworks Selected
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">SLA GUARANTEE</span>
                        <span className="text-emerald-500 font-medium">4-HOUR ARCHITECT ROUTING</span>
                    </div>
                </div>

                {/* Direct Fast-Track Calendar Action */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                    <button
                        type="button"
                        onClick={() => setIsCalendarOpen(true)}
                        className="w-full btn-primary h-12 text-sm flex items-center justify-center gap-2 group"
                    >
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        Fast-Track 30-Min Architecture Call
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <CalendarBookingEmbed
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    prefill={{
                        name: formData.name,
                        email: formData.email,
                        company: formData.company,
                        notes: `Deployment: ${formData.deploymentTarget} | Workflow: ${formData.targetWorkflow}`
                    }}
                    context={{
                        solutionSlug: formData.leadSource,
                        complianceFrameworks: formData.complianceMatrix
                    }}
                />
            </div>
        )
    }

    const panel = LEFT_PANEL[step - 1]

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black font-sans">
            {/* ── Top Dual-Track Tab Switcher ───────────────────────────────────── */}
            <div className="border-b border-gray-100 dark:border-white/5 px-6 py-3.5 bg-gray-50/50 dark:bg-black/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('fast-track')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            activeTab === 'fast-track'
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold'
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        Fast-Track 30-Min Audit
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('dossier')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            activeTab === 'dossier'
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold'
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                        Sovereign Architecture Dossier
                    </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>Mutual NDA Protected</span>
                </div>
            </div>

            {/* ── Track 1: Fast-Track Direct Calendar Booking ──────────────────── */}
            {activeTab === 'fast-track' && (
                <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center max-w-2xl mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
                        <Calendar className="w-6 h-6" />
                    </div>

                    <span className="inline-block text-[11px] font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">
                        Direct Principal Systems Architect Access
                    </span>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
                        Schedule Your 30-Minute Architecture Audit
                    </h2>

                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">
                        Meet 1-on-1 with <strong className="text-gray-900 dark:text-white">Chaman Shah (Principal AI Systems Architect)</strong> to review your existing ERP connectors, LLM latency bottlenecks, and air-gapped VPC deployment requirements.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left font-mono text-xs mb-8">
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">Mutual NDA Governed</div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400">Pre-executed confidentiality terms</div>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <Cpu className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">LangGraph DAG Blueprint</div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400">Hardware sizing & state topology</div>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">DPDP Act 2023 Compliant</div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400">Strict local data residency</div>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">4-Hour SLA Routing</div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400">Executive memo dispatched post-call</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <button
                            type="button"
                            onClick={() => setIsCalendarOpen(true)}
                            className="btn-primary h-13 px-8 text-base flex items-center justify-center gap-2 group w-full sm:w-auto"
                        >
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            Open Calendar Scheduler
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('dossier')}
                            className="h-13 px-6 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors"
                        >
                            Or Submit Architecture Dossier (Asynchronous)
                        </button>
                    </div>

                    <CalendarBookingEmbed
                        isOpen={isCalendarOpen}
                        onClose={() => setIsCalendarOpen(false)}
                        context={{
                            solutionSlug: source,
                            complianceFrameworks: ['DPDP Act 2023', 'Private Air-Gapped VPC']
                        }}
                    />
                </div>
            )}

            {/* ── Track 2: Sovereign Architecture Dossier (3-Step Form) ────────── */}
            {activeTab === 'dossier' && (
                <div className="flex flex-col md:flex-row flex-1">
                    {/* Left Panel */}
                    <div className="w-full md:w-5/12 bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-100 dark:border-white/5 p-6 md:p-12 lg:p-14 flex flex-col justify-between">
                        <div className="max-w-md mx-auto md:mx-0">
                            {/* Step tracker */}
                            <div className="flex items-center gap-4 mb-8">
                                {STEPS.map((s, i) => (
                                    <div key={s.num} className="flex items-center gap-2">
                                        <span
                                            className={`text-[11px] font-mono font-bold transition-colors ${
                                                step === i + 1
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : step > i + 1
                                                    ? 'text-gray-400 dark:text-gray-600 line-through'
                                                    : 'text-gray-300 dark:text-gray-700'
                                            }`}
                                        >
                                            {s.num}. {s.label}
                                        </span>
                                        {i < STEPS.length - 1 && (
                                            <span className="h-px w-3 bg-gray-200 dark:bg-white/10" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <span className="inline-block text-[11px] font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-4">
                                {panel.badge}
                            </span>

                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-gray-900 dark:text-white">
                                {panel.heading}
                            </h2>

                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                {panel.body}
                            </p>

                            {/* Trust Pillar */}
                            <div className="space-y-2 pt-4 border-t border-gray-200/60 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Zero Third-Party Training Leakage</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>DPDP Act 2023 Statutory Governance</span>
                                </div>
                            </div>
                        </div>

                        <p className="hidden md:block text-[11px] text-gray-400 dark:text-gray-600 mt-8 font-mono">
                            Confidential. Protected under mutual non-disclosure terms.
                        </p>
                    </div>

                    {/* Right Panel */}
                    <div className="w-full md:w-7/12 p-6 md:p-12 lg:p-14 flex flex-col justify-center bg-white dark:bg-black">
                        <div className="max-w-lg mx-auto w-full">
                            <AnimatePresence mode="wait">
                                {/* Step 1 — Identification */}
                                {step === 1 && (
                                    <motion.form
                                        key="step1"
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -24 }}
                                        transition={{ duration: 0.25 }}
                                        onSubmit={next}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label htmlFor="email" className={labelClass}>
                                                    Corporate Work Email <span className="text-red-500">*</span>
                                                </label>
                                                {emailValidation && (
                                                    <span className={`text-[11px] font-mono ${
                                                        emailValidation.category === 'enterprise' 
                                                            ? 'text-emerald-500' 
                                                            : emailValidation.category === 'consumer'
                                                            ? 'text-amber-500'
                                                            : 'text-rose-500'
                                                    }`}>
                                                        {emailValidation.badgeText}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="cto@enterprise.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="website" className={labelClass}>
                                                Company Website or LinkedIn URL <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                id="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="https://company.com"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={emailValidation?.category === 'disposable'}
                                            className="w-full btn-primary h-13 text-base flex items-center justify-center gap-2 group mt-4 disabled:opacity-50"
                                        >
                                            Continue to Infrastructure Scope
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.form>
                                )}

                                {/* Step 2 — Infrastructure Scope & Compliance */}
                                {step === 2 && (
                                    <motion.form
                                        key="step2"
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -24 }}
                                        transition={{ duration: 0.25 }}
                                        onSubmit={next}
                                        className="space-y-6"
                                    >
                                        {/* Deployment Target */}
                                        <div>
                                            <label htmlFor="deploymentTarget" className={labelClass}>
                                                Target Deployment Perimeter <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    id="deploymentTarget"
                                                    value={formData.deploymentTarget}
                                                    onChange={handleChange}
                                                    className={selectClass}
                                                >
                                                    {DEPLOYMENT_TARGETS.map(t => (
                                                        <option key={t.id} value={t.label}>{t.label}</option>
                                                    ))}
                                                </select>
                                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    ▾
                                                </span>
                                            </div>
                                        </div>

                                        {/* Regulatory & Compliance Matrix */}
                                        <div>
                                            <label className={labelClass}>
                                                Statutory Compliance & Governance Envelopes <span className="text-red-500">*</span>
                                            </label>
                                            <div className="space-y-2">
                                                {COMPLIANCE_OPTIONS.map(standard => {
                                                    const isChecked = formData.complianceMatrix.includes(standard)
                                                    return (
                                                        <button
                                                            key={standard}
                                                            type="button"
                                                            onClick={() => toggleCompliance(standard)}
                                                            className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition-all ${
                                                                isChecked
                                                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-medium'
                                                                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.08]'
                                                            }`}
                                                        >
                                                            <span>{standard}</span>
                                                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                                                isChecked 
                                                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                                    : 'border-gray-300 dark:border-white/20'
                                                            }`}>
                                                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Concurrency & Latency Profile */}
                                        <div>
                                            <label htmlFor="concurrencyEnvelope" className={labelClass}>
                                                Latency & Throughput Requirements <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    id="concurrencyEnvelope"
                                                    value={formData.concurrencyEnvelope}
                                                    onChange={handleChange}
                                                    className={selectClass}
                                                >
                                                    {CONCURRENCY_OPTIONS.map(c => (
                                                        <option key={c.id} value={c.label}>{c.label}</option>
                                                    ))}
                                                </select>
                                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    ▾
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={back}
                                                className="w-1/4 h-13 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 btn-primary h-13 text-base flex items-center justify-center gap-2 group"
                                            >
                                                Continue to Executive Dossier
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.form>
                                )}

                                {/* Step 3 — Executive Profile & Scope */}
                                {step === 3 && (
                                    <motion.form
                                        key="step3"
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -24 }}
                                        transition={{ duration: 0.25 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="name" className={labelClass}>
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="Dr. Rajesh Menon"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="role" className={labelClass}>
                                                    Executive Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    id="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="Chief Technology Officer"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="company" className={labelClass}>
                                                Organization / Enterprise <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                required
                                                id="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="Acme Financial Technologies"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="targetWorkflow" className={labelClass}>
                                                Target Architecture Scope / Workflow to Automate <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                required
                                                id="targetWorkflow"
                                                value={formData.targetWorkflow}
                                                onChange={handleChange as any}
                                                className={`${inputClass} min-h-[90px] resize-y`}
                                                placeholder="e.g. Deploy air-gapped LangGraph multi-agent cluster for autonomous invoice reconciliation against SAP S/4HANA with DPDP Act 2023 audit trails..."
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="attributionSource" className={labelClass}>
                                                Discovery Channel <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    id="attributionSource"
                                                    value={formData.attributionSource}
                                                    onChange={handleChange}
                                                    className={selectClass}
                                                >
                                                    <option value="" disabled>Select discovery source</option>
                                                    <option value="google-search">Google Search (Topical Authority)</option>
                                                    <option value="ai-engine">AI Search Engine (Perplexity / ChatGPT / Claude)</option>
                                                    <option value="technical-whitepaper">Elesium Technical Whitepaper / Research Signal</option>
                                                    <option value="interactive-tool">Interactive Simulator / Calculator Tool</option>
                                                    <option value="peer-referral">Peer / Industry Executive Referral</option>
                                                    <option value="linkedin">LinkedIn / Technical Engineering Post</option>
                                                </select>
                                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    ▾
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={back}
                                                disabled={isLoading}
                                                className="w-1/4 h-13 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-1 btn-primary h-13 text-base flex items-center justify-center gap-2 group disabled:opacity-60"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        Ingest Architecture Dossier
                                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            <p className="text-center text-[11px] font-mono text-gray-400 dark:text-gray-600 mt-6">
                                Step {step} of 3 · Dispatched directly to Principal Systems Architect.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
