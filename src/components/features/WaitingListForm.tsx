import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

// ─── Step indicators ──────────────────────────────────────────────────────────

const STEPS = [
    { num: '01', label: 'Identification' },
    { num: '02', label: 'Qualification' },
    { num: '03', label: 'Profile' },
]

// ─── Left panel copy per step ─────────────────────────────────────────────────

const LEFT_PANEL = [
    {
        badge: 'Priority Partner Application',
        heading: 'Enter Your Credentials.',
        body: 'We selectively engage with qualified principals. This application is the first step in an exclusive intake process — not a signup form.',
    },
    {
        badge: 'Qualification Screen',
        heading: 'Demonstrate Readiness.',
        body: 'Our active engagements are reserved for organizations with the capacity and urgency to act on high-quality introductions. These questions are non-negotiable.',
    },
    {
        badge: 'Final Profile',
        heading: 'Complete Your Dossier.',
        body: 'We review each application manually. A senior associate will respond within 24 hours with a decision and, if approved, next steps.',
    },
]

// ─── Form data type ───────────────────────────────────────────────────────────

type FormData = {
    email: string
    website: string
    revenue: string
    certifications: string
    readiness: string
    name: string
    company: string
    role: string
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-[15px]'

const selectClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-[15px] cursor-pointer appearance-none'

const labelClass = 'block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'

// ─── Main export (legacy name kept so existing imports don't break) ────────────

export function WaitingListForm() {
    return <MandateApplicationForm />
}

export function MandateApplicationForm() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        email: '',
        website: '',
        revenue: '',
        certifications: '',
        readiness: '',
        name: '',
        company: '',
        role: '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const next = (e: FormEvent) => {
        e.preventDefault()
        setStep(s => Math.min(s + 1, 3))
    }

    const back = () => setStep(s => Math.max(s - 1, 1))

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch('http://localhost:3001/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            }).catch(() => null)

            if (response && response.ok) {
                setIsLoading(false)
                setIsSuccess(true)
                return
            }
            throw new Error('Fallback')
        } catch {
            await new Promise(r => setTimeout(r, 1600))
            setIsSuccess(true)
            setIsLoading(false)
        }
    }

    // ── Success state ──────────────────────────────────────────────────────────
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in duration-500 bg-white dark:bg-black">
                <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-9 w-9 text-gray-900 dark:text-white" />
                </div>
                <span className="text-[11px] font-medium tracking-[0.06em] text-gray-400 mb-4">
                    Application Status: Under Review
                </span>
                <h3 className="text-3xl md:text-4xl font-semibold mb-4 dark:text-white tracking-tight">
                    Application Under Review.
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm text-base leading-relaxed">
                    A senior associate will review your profile and respond within{' '}
                    <strong className="text-gray-900 dark:text-white">24 hours</strong> with
                    a decision and, if approved, a proposed engagement structure.
                </p>
            </div>
        )
    }

    const panel = LEFT_PANEL[step - 1]

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* ── Left Panel ──────────────────────────────────────────────────── */}
            <div className="w-full md:w-5/12 bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-100 dark:border-white/5 p-6 md:p-12 lg:p-16 flex flex-col justify-between">
                <div className="max-w-md mx-auto md:mx-0">
                    {/* Step tracker */}
                    <div className="flex items-center gap-6 mb-10">
                        {STEPS.map((s, i) => (
                            <div key={s.num} className="flex items-center gap-2">
                                <span
                                    className={`text-[11px] font-bold transition-colors ${
                                        step === i + 1
                                            ? 'text-gray-900 dark:text-white'
                                            : step > i + 1
                                            ? 'text-gray-400 dark:text-gray-600 line-through'
                                            : 'text-gray-300 dark:text-gray-700'
                                    }`}
                                >
                                    {s.num}
                                </span>
                                {i < STEPS.length - 1 && (
                                    <span className="h-px w-4 bg-gray-200 dark:bg-white/10" />
                                )}
                            </div>
                        ))}
                    </div>

                    <span className="inline-block text-[11px] font-medium tracking-[0.06em] text-gray-400 dark:text-gray-500 mb-6">
                        {panel.badge}
                    </span>

                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-5 dark:text-white">
                        {panel.heading}
                    </h2>

                    <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {panel.body}
                    </p>
                </div>

                {/* Bottom disclaimer */}
                <p className="hidden md:block text-[11px] text-gray-300 dark:text-gray-700 mt-10 font-medium">
                    Confidential. Not shared with third parties.
                </p>
            </div>

            {/* ── Right Panel ─────────────────────────────────────────────────── */}
            <div className="w-full md:w-7/12 p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-black">
                <div className="max-w-lg mx-auto w-full">
                    <AnimatePresence mode="wait">
                        {/* Step 1 — Identity */}
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.35 }}
                                onSubmit={next}
                                className="space-y-5"
                            >
                                <div>
                                    <label htmlFor="email" className={labelClass}>
                                        Work Email <span className="text-gray-400">*</span>
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="you@company.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="website" className={labelClass}>
                                        Company Website / LinkedIn <span className="text-gray-400">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        id="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="company.com"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full btn-primary h-13 text-base flex items-center justify-center gap-2 group mt-2"
                                >
                                    Continue
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.form>
                        )}

                        {/* Step 2 — Qualification */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.35 }}
                                onSubmit={next}
                                className="space-y-6"
                            >
                                {/* Revenue */}
                                <div>
                                    <label htmlFor="revenue" className={labelClass}>
                                        What is your current monthly revenue? <span className="text-gray-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            required
                                            id="revenue"
                                            value={formData.revenue}
                                            onChange={handleChange}
                                            className={selectClass}
                                        >
                                            <option value="" disabled>Select a range</option>
                                            <option value="under-500k">Under $500K</option>
                                            <option value="500k-2m">$500K – $2M</option>
                                            <option value="2m-10m">$2M – $10M</option>
                                            <option value="10m-plus">$10M+</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            ▾
                                        </span>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div>
                                    <label htmlFor="certifications" className={labelClass}>
                                        What certifications or compliance standards do your ideal partners require? <span className="text-gray-400">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        id="certifications"
                                        value={formData.certifications}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="e.g. AS9100, ISO 9001, NADCAP, ITAR..."
                                    />
                                </div>

                                {/* Readiness */}
                                <div>
                                    <label htmlFor="readiness" className={labelClass}>
                                        Are you prepared to handle an influx of 5–10 qualified introductions this quarter? <span className="text-gray-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            required
                                            id="readiness"
                                            value={formData.readiness}
                                            onChange={handleChange}
                                            className={selectClass}
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="yes">Yes — we have capacity and urgency</option>
                                            <option value="no">No — not at this time</option>
                                            <option value="discuss">I need to discuss this first</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            ▾
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={back}
                                        className="w-1/4 h-13 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary h-13 text-base flex items-center justify-center gap-2 group"
                                    >
                                        Continue
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* Step 3 — Profile */}
                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.35 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className={labelClass}>
                                            Full Name <span className="text-gray-400">*</span>
                                        </label>
                                        <input
                                            required
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClass}
                                            placeholder="Jane Smith"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className={labelClass}>
                                            Title / Role <span className="text-gray-400">*</span>
                                        </label>
                                        <input
                                            required
                                            id="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className={inputClass}
                                            placeholder="VP of Operations"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="company" className={labelClass}>
                                        Company Name <span className="text-gray-400">*</span>
                                    </label>
                                    <input
                                        required
                                        id="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Acme Aerospace Inc."
                                    />
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={back}
                                        disabled={isLoading}
                                        className="w-1/4 h-13 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
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
                                                Submit Application
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <p className="text-center text-[11px] text-gray-300 dark:text-gray-700 mt-6 font-medium">
                        Step {step} of 3 · Applications reviewed within 24 hours.
                    </p>
                </div>
            </div>
        </div>
    )
}
