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
    FileText,
    MessageSquare
} from 'lucide-react'
import { validateEnterpriseEmail, DomainValidationResult } from '../cro/corporateDomainValidator'
import { useWhatsApp } from '../../hooks/useWhatsApp'

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

// ─── Directional Slide Variants ───────────────────────────────────────────────

const stepVariants = {
    enter: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? 28 : -28,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? -28 : 28,
    }),
}

const stepTransition = {
    type: 'spring' as const,
    stiffness: 320,
    damping: 30,
}

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

const inputBaseClass =
    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-white/5 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-[15px]'

const inputNormalBorder = 'border-neutral-200 dark:border-white/10'
const inputErrorBorder = 'border-black dark:border-white ring-1 ring-black/40 dark:ring-white/40'

const selectBaseClass =
    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#111] text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-[15px] cursor-pointer appearance-none'

const labelClass = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'

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
    const [direction, setDirection] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({})
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

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

    const triggerFieldErrors = (errors: Record<string, string>) => {
        setFieldErrors(errors)
        const nextShake: Record<string, boolean> = {}
        Object.keys(errors).forEach(k => {
            nextShake[k] = true
        })
        setShakeFields({})
        requestAnimationFrame(() => {
            setShakeFields(nextShake)
        })
        setTimeout(() => {
            setShakeFields({})
        }, 550)
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
        if (fieldErrors[id]) {
            setFieldErrors(prev => {
                const copy = { ...prev }
                delete copy[id]
                return copy
            })
        }
    }

    const toggleCompliance = (standard: string) => {
        setFormData(prev => {
            const nextMatrix = prev.complianceMatrix.includes(standard)
                ? prev.complianceMatrix.filter(s => s !== standard)
                : [...prev.complianceMatrix, standard]
            return { ...prev, complianceMatrix: nextMatrix }
        })
        if (fieldErrors.complianceMatrix) {
            setFieldErrors(prev => {
                const copy = { ...prev }
                delete copy.complianceMatrix
                return copy
            })
        }
    }

    const validateCurrentStep = (): boolean => {
        const errors: Record<string, string> = {}

        if (step === 1) {
            const emailResult = validateEnterpriseEmail(formData.email)
            if (!formData.email.trim()) {
                errors.email = 'Corporate work email is required.'
            } else if (!emailResult.isValidFormat) {
                errors.email = 'Enter a valid corporate email address.'
            } else if (emailResult.category === 'disposable') {
                errors.email = 'Disposable email domains are not accepted.'
            }
            if (!formData.website.trim()) {
                errors.website = 'Company website or LinkedIn URL is required.'
            }
        } else if (step === 2) {
            if (!formData.deploymentTarget) {
                errors.deploymentTarget = 'Select a target deployment perimeter.'
            }
            if (formData.complianceMatrix.length === 0) {
                errors.complianceMatrix = 'Select at least one compliance framework.'
            }
            if (!formData.concurrencyEnvelope) {
                errors.concurrencyEnvelope = 'Select a latency profile.'
            }
        } else if (step === 3) {
            if (!formData.name.trim()) {
                errors.name = 'Full name is required.'
            }
            if (!formData.role.trim()) {
                errors.role = 'Executive title is required.'
            }
            if (!formData.company.trim()) {
                errors.company = 'Organization name is required.'
            }
            if (!formData.targetWorkflow.trim()) {
                errors.targetWorkflow = 'Describe the target workflow.'
            }
            if (!formData.attributionSource) {
                errors.attributionSource = 'Select a discovery channel.'
            }
        }

        if (Object.keys(errors).length > 0) {
            triggerFieldErrors(errors)
            return false
        }

        setFieldErrors({})
        return true
    }

    const next = (e: FormEvent) => {
        e.preventDefault()
        if (!validateCurrentStep()) return
        setDirection(1)
        setStep(s => Math.min(s + 1, 3))
    }

    const back = () => {
        setFieldErrors({})
        setDirection(-1)
        setStep(s => Math.max(s - 1, 1))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!validateCurrentStep()) return
        setIsLoading(true)

        const dossierCode = `ELS-ARCH-${Date.now().toString(36).toUpperCase()}`

        const submissionPayload = {
            ...formData,
            dossierCode,
            submittedAt: new Date().toISOString(),
            priorityScore: emailValidation?.priorityScore || 80
        }

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
                <div className="relative flex items-center justify-center h-20 w-20 mb-6">
                    <span className="absolute inline-flex h-16 w-16 rounded-full border border-neutral-300 dark:border-white/20" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/20 text-black dark:text-white">
                        <CheckCircle2 className="h-7 w-7" />
                    </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/15 text-black dark:text-white rounded-full text-[11px] font-mono tracking-wider uppercase mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Architecture Dossier Ingested
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-black dark:text-white tracking-tight leading-snug">
                    Sovereign Engineering Review Under Way.
                </h3>

                <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-sm leading-relaxed mb-6">
                    Your infrastructure requirements have been queued for direct evaluation by <strong className="text-black dark:text-white">Chaman Shah (Principal AI Systems Architect)</strong>. A preliminary LangGraph DAG state machine topology and TCO projection will be dispatched to <span className="font-mono text-black dark:text-white underline">{formData.email}</span> within 4 hours.
                </p>

                <div className="w-full max-w-md bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 rounded-2xl p-5 text-left font-mono text-xs space-y-2.5 mb-6">
                    <div className="flex justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
                        <span className="text-neutral-500">STATUS</span>
                        <span className="text-black dark:text-white font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                            PRINCIPAL DISPATCH ACTIVE
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
                        <span className="text-neutral-500">ORGANIZATION</span>
                        <span className="text-black dark:text-white truncate max-w-[200px]">{formData.company || 'Enterprise Partner'}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
                        <span className="text-neutral-500">DEPLOYMENT PERIMETER</span>
                        <span className="text-black dark:text-white truncate max-w-[200px]">{formData.deploymentTarget}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
                        <span className="text-neutral-500">COMPLIANCE MATRIX</span>
                        <span className="text-black dark:text-white font-mono text-[11px]">
                            {formData.complianceMatrix.length} Frameworks Selected
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-500">SLA GUARANTEE</span>
                        <span className="text-black dark:text-white font-medium">4-HOUR ARCHITECT ROUTING</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                    <button
                        type="button"
                        onClick={openWhatsApp}
                        className="w-full btn-primary h-12 text-sm flex items-center justify-center gap-2 group active:scale-[0.97]"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Chat on WhatsApp with Lead Architect
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <WhatsAppModal />
            </div>
        )
    }

    const panel = LEFT_PANEL[step - 1]

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black font-sans">
            {/* ── Top Dual-Track Tab Switcher ───────────────────────────────────── */}
            <div className="border-b border-neutral-200 dark:border-white/10 px-6 py-3.5 bg-neutral-50/50 dark:bg-black/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('fast-track')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition active:scale-[0.97] ${
                            activeTab === 'fast-track'
                                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        Fast-Track 30-Min Audit
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('dossier')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition active:scale-[0.97] ${
                            activeTab === 'dossier'
                                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Sovereign Architecture Dossier
                    </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                    <Lock className="w-3 h-3 text-black dark:text-white" />
                    <span>Mutual NDA Protected</span>
                </div>
            </div>

            {/* ── Track 1: Fast-Track Direct Calendar Booking ──────────────────── */}
            {activeTab === 'fast-track' && (
                <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center max-w-2xl mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-black dark:text-white flex items-center justify-center mb-6">
                        <Calendar className="w-6 h-6" />
                    </div>

                    <span className="inline-block text-[11px] font-mono tracking-wider text-neutral-500 uppercase mb-3">
                        Direct Principal Systems Architect Access
                    </span>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-white mb-4">
                        Schedule Your 30-Minute Architecture Audit
                    </h2>

                    <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 max-w-lg">
                        Meet 1-on-1 with <strong className="text-black dark:text-white">Chaman Shah (Principal AI Systems Architect)</strong> to review your existing ERP connectors, LLM latency bottlenecks, and air-gapped VPC deployment requirements.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left font-mono text-xs mb-8">
                        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-black dark:text-white">Mutual NDA Governed</div>
                                <div className="text-[11px] text-neutral-500">Pre-executed confidentiality terms</div>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <Cpu className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-black dark:text-white">LangGraph DAG Blueprint</div>
                                <div className="text-[11px] text-neutral-500">Hardware sizing &amp; state topology</div>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-black dark:text-white">DPDP Act 2023 Compliant</div>
                                <div className="text-[11px] text-neutral-500">Strict local data residency</div>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.02] flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-black dark:text-white">4-Hour SLA Routing</div>
                                <div className="text-[11px] text-neutral-500">Executive memo dispatched post-call</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <button
                            type="button"
                            onClick={openWhatsApp}
                            className="btn-primary h-13 px-8 text-base flex items-center justify-center gap-2 group w-full sm:w-auto active:scale-[0.97]"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Chat on WhatsApp with Lead Architect
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('dossier')}
                            className="h-13 px-6 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 text-sm font-medium transition active:scale-[0.97]"
                        >
                            Or Submit Architecture Dossier (Asynchronous)
                        </button>
                    </div>
                </div>
            )}

            {/* ── Track 2: Sovereign Architecture Dossier (3-Step Form) ────────── */}
            {activeTab === 'dossier' && (
                <div className="flex flex-col md:flex-row flex-1">
                    {/* Left Panel */}
                    <div className="w-full md:w-5/12 bg-neutral-50 dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-white/10 p-6 md:p-12 lg:p-14 flex flex-col justify-between">
                        <div className="max-w-md mx-auto md:mx-0">
                            {/* Step tracker */}
                            <div className="flex items-center gap-4 mb-8">
                                {STEPS.map((s, i) => (
                                    <div key={s.num} className="flex items-center gap-2">
                                        <span
                                            className={`text-[11px] font-mono font-bold transition-colors ${
                                                step === i + 1
                                                    ? 'text-black dark:text-white'
                                                    : step > i + 1
                                                    ? 'text-neutral-500 line-through'
                                                    : 'text-neutral-300 dark:text-neutral-700'
                                            }`}
                                        >
                                            {s.num}. {s.label}
                                        </span>
                                        {i < STEPS.length - 1 && (
                                            <span className="h-px w-3 bg-neutral-200 dark:bg-white/10" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <span className="inline-block text-[11px] font-mono tracking-wider text-neutral-500 uppercase mb-4">
                                {panel.badge}
                            </span>

                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-black dark:text-white">
                                {panel.heading}
                            </h2>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                                {panel.body}
                            </p>

                            {/* Trust Pillar */}
                            <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-white/10 text-xs text-neutral-500 font-mono">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span>Zero Third-Party Training Leakage</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span>DPDP Act 2023 Statutory Governance</span>
                                </div>
                            </div>
                        </div>

                        <p className="hidden md:block text-[11px] text-neutral-500 mt-8 font-mono">
                            Confidential. Protected under mutual non-disclosure terms.
                        </p>
                    </div>

                    {/* Right Panel */}
                    <div className="w-full md:w-7/12 p-6 md:p-12 lg:p-14 flex flex-col justify-center bg-white dark:bg-black overflow-hidden">
                        <div className="max-w-lg mx-auto w-full">
                            <AnimatePresence mode="wait" custom={direction}>
                                {/* Step 1: Identification */}
                                {step === 1 && (
                                    <motion.form
                                        key="step1"
                                        custom={direction}
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={stepTransition}
                                        noValidate
                                        onSubmit={next}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label htmlFor="email" className={labelClass}>
                                                    Corporate Work Email <span className="text-neutral-500">*</span>
                                                </label>
                                                {emailValidation && (
                                                    <span
                                                        className={`text-[11px] font-mono ${
                                                            emailValidation.category === 'enterprise'
                                                                ? 'text-black dark:text-white font-semibold'
                                                                : 'text-neutral-500'
                                                        }`}
                                                    >
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
                                                aria-invalid={Boolean(fieldErrors.email)}
                                                className={`${inputBaseClass} ${
                                                    fieldErrors.email ? inputErrorBorder : inputNormalBorder
                                                } ${shakeFields.email ? 'animate-shake' : ''}`}
                                                placeholder="cto@enterprise.com"
                                            />
                                            {fieldErrors.email && (
                                                <p className="mt-1.5 text-xs font-mono text-black dark:text-white">
                                                    {fieldErrors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="website" className={labelClass}>
                                                Company Website or LinkedIn URL <span className="text-neutral-500">*</span>
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                id="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                aria-invalid={Boolean(fieldErrors.website)}
                                                className={`${inputBaseClass} ${
                                                    fieldErrors.website ? inputErrorBorder : inputNormalBorder
                                                } ${shakeFields.website ? 'animate-shake' : ''}`}
                                                placeholder="https://company.com"
                                            />
                                            {fieldErrors.website && (
                                                <p className="mt-1.5 text-xs font-mono text-black dark:text-white">
                                                    {fieldErrors.website}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full btn-primary h-13 text-base flex items-center justify-center gap-2 group mt-4 active:scale-[0.97]"
                                        >
                                            Continue to Infrastructure Scope
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.form>
                                )}

                                {/* Step 2: Infrastructure Scope & Compliance */}
                                {step === 2 && (
                                    <motion.form
                                        key="step2"
                                        custom={direction}
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={stepTransition}
                                        noValidate
                                        onSubmit={next}
                                        className="space-y-6"
                                    >
                                        {/* Deployment Target */}
                                        <div>
                                            <label htmlFor="deploymentTarget" className={labelClass}>
                                                Target Deployment Perimeter <span className="text-neutral-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    id="deploymentTarget"
                                                    value={formData.deploymentTarget}
                                                    onChange={handleChange}
                                                    className={`${selectBaseClass} ${
                                                        fieldErrors.deploymentTarget ? inputErrorBorder : inputNormalBorder
                                                    } ${shakeFields.deploymentTarget ? 'animate-shake' : ''}`}
                                                >
                                                    {DEPLOYMENT_TARGETS.map(t => (
                                                        <option key={t.id} value={t.label}>{t.label}</option>
                                                    ))}
                                                </select>
                                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                                    &#9662;
                                                </span>
                                            </div>
                                        </div>

                                        {/* Regulatory & Compliance Matrix */}
                                        <div>
                                            <label className={labelClass}>
                                                Statutory Compliance &amp; Governance Envelopes <span className="text-neutral-500">*</span>
                                            </label>
                                            <div className={`space-y-2 ${shakeFields.complianceMatrix ? 'animate-shake' : ''}`}>
                                                {COMPLIANCE_OPTIONS.map(standard => {
                                                    const isChecked = formData.complianceMatrix.includes(standard)
                                                    return (
                                                        <button
                                                            key={standard}
                                                            type="button"
                                                            onClick={() => toggleCompliance(standard)}
                                                            className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition active:scale-[0.99] ${
                                                                isChecked
                                                                    ? 'border-black bg-black/5 text-black dark:border-white dark:bg-white/10 dark:text-white font-medium'
                                                                    : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.08]'
                                                            }`}
                                                        >
                                                            <span>{standard}</span>
                                                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                                                isChecked
                                                                    ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black'
                                                                    : 'border-neutral-300 dark:border-white/20'
                                                            }`}>
                                                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            {fieldErrors.complianceMatrix && (
                                                <p className="mt-1.5 text-xs font-mono text-black dark:text-white">
                                                    {fieldErrors.complianceMatrix}
                                                </p>
                                            )}
                                        </div>

                                        {/* Concurrency & Latency Profile */}
                                        <div>
                                            <label htmlFor="concurrencyEnvelope" className={labelClass}>
                                                Latency &amp; Throughput Requirements <span className="text-neutral-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    id="concurrencyEnvelope"
                                                    value={formData.concurrencyEnvelope}
                                                    onChange={handleChange}
                                                    className={`${selectBaseClass} ${
                                                        fieldErrors.concurrencyEnvelope ? inputErrorBorder : inputNormalBorder
                                                    } ${shakeFields.concurrencyEnvelope ? 'animate-shake' : ''}`}
                                                >
                                                    {CONCURRENCY_OPTIONS.map(c => (
                                                        <option key={c.id} value={c.label}>{c.label}</option>
                                                    ))}
                                                </select>
                                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                                    &#9662;
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={back}
                                                className="w-1/4 h-13 flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/10 transition active:scale-[0.97]"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 btn-primary h-13 text-base flex items-center justify-center gap-2 group active:scale-[0.97]"
                                            >
                                                Continue to Executive Dossier
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.form>
                                )}

                                {/* Step 3: Executive Profile & Scope */}
                                {step === 3 && (
                                    <motion.form
                                        key="step3"
                                        custom={direction}
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={stepTransition}
                                        noValidate
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="name" className={labelClass}>
                                                    Full Name <span className="text-neutral-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    aria-invalid={Boolean(fieldErrors.name)}
                                                    className={`${inputBaseClass} ${
                                                        fieldErrors.name ? inputErrorBorder : inputNormalBorder
                                                    } ${shakeFields.name ? 'animate-shake' : ''}`}
                                                    placeholder="Dr. Rajesh Menon"
                                                />
                                                {fieldErrors.name && (
                                                    <p className="mt-1 text-xs font-mono text-black dark:text-white">
                                                        {fieldErrors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="role" className={labelClass}>
                                                    Executive Title <span className="text-neutral-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    id="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    aria-invalid={Boolean(fieldErrors.role)}
                                                    className={`${inputBaseClass} ${
                                                        fieldErrors.role ? inputErrorBorder : inputNormalBorder
                                                    } ${shakeFields.role ? 'animate-shake' : ''}`}
                                                    placeholder="Chief Technology Officer"
                                                />
                                                {fieldErrors.role && (
                                                    <p className="mt-1 text-xs font-mono text-black dark:text-white">
                                                        {fieldErrors.role}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="company" className={labelClass}>
                                                Organization / Enterprise <span className="text-neutral-500">*</span>
                                            </label>
                                            <input
                                                required
                                                id="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                aria-invalid={Boolean(fieldErrors.company)}
                                                className={`${inputBaseClass} ${
                                                    fieldErrors.company ? inputErrorBorder : inputNormalBorder
                                                } ${shakeFields.company ? 'animate-shake' : ''}`}
                                                placeholder="Acme Financial Technologies"
                                            />
                                            {fieldErrors.company && (
                                                <p className="mt-1 text-xs font-mono text-black dark:text-white">
                                                    {fieldErrors.company}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="targetWorkflow" className={labelClass}>
                                                Target Architecture Scope / Workflow to Automate <span className="text-neutral-500">*</span>
                                            </label>
                                            <textarea
                                                required
                                                id="targetWorkflow"
                                                value={formData.targetWorkflow}
                                                onChange={handleChange}
                                                aria-invalid={Boolean(fieldErrors.targetWorkflow)}
                                                className={`${inputBaseClass} min-h-[90px] resize-y ${
                                                    fieldErrors.targetWorkflow ? inputErrorBorder : inputNormalBorder
                                                } ${shakeFields.targetWorkflow ? 'animate-shake' : ''}`}
                                                placeholder="e.g. Deploy air-gapped LangGraph multi-agent cluster for autonomous invoice reconciliation against SAP S/4HANA with DPDP Act 2023 audit trails..."
                                            />
                                            {fieldErrors.targetWorkflow && (
                                                <p className="mt-1 text-xs font-mono text-black dark:text-white">
                                                    {fieldErrors.targetWorkflow}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="attributionSource" className={labelClass}>
                                                Discovery Channel <span className="text-neutral-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    id="attributionSource"
                                                    value={formData.attributionSource}
                                                    onChange={handleChange}
                                                    aria-invalid={Boolean(fieldErrors.attributionSource)}
                                                    className={`${selectBaseClass} ${
                                                        fieldErrors.attributionSource ? inputErrorBorder : inputNormalBorder
                                                    } ${shakeFields.attributionSource ? 'animate-shake' : ''}`}
                                                >
                                                    <option value="" disabled>Select discovery source</option>
                                                    <option value="google-search">Google Search</option>
                                                    <option value="ai-engine">AI Search Engine (Perplexity / ChatGPT / Claude)</option>
                                                    <option value="technical-whitepaper">Elesium Technical Whitepaper / Research Signal</option>
                                                    <option value="interactive-tool">Interactive Simulator / Calculator Tool</option>
                                                    <option value="peer-referral">Peer / Industry Executive Referral</option>
                                                    <option value="linkedin">LinkedIn / Technical Engineering Post</option>
                                                </select>
                                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                                    &#9662;
                                                </span>
                                            </div>
                                            {fieldErrors.attributionSource && (
                                                <p className="mt-1 text-xs font-mono text-black dark:text-white">
                                                    {fieldErrors.attributionSource}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={back}
                                                disabled={isLoading}
                                                className="w-1/4 h-13 flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/10 transition active:scale-[0.97] disabled:opacity-40"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-1 btn-primary h-13 text-base flex items-center justify-center gap-2 group active:scale-[0.97] disabled:opacity-60"
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

                            <p className="text-center text-[11px] font-mono text-neutral-500 mt-6">
                                Step {step} of 3 &middot; Dispatched directly to Principal Systems Architect.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <WhatsAppModal />
        </div>
    )
}
