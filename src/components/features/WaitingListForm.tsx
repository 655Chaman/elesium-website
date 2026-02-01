import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

export function WaitingListForm() {
    const [step, setStep] = useState(1) // 1: Opt-in, 2: Qualification
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        website: '',
        name: '',
        company: '',
        usecase: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleNext = (e: FormEvent) => {
        e.preventDefault()
        setStep(2)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Here we would call the backend API (Notion)
        try {
            const response = await fetch('http://localhost:3001/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error('Network response was not ok')

            setIsLoading(false)
            setIsSuccess(true)
        } catch (error) {
            console.error("Submission failed", error)
            // Fallback for demo if server isn't running
            await new Promise(resolve => setTimeout(resolve, 1000))
            setIsSuccess(true)
            setIsLoading(false)
        }

    }


    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in duration-500">
                <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4 dark:text-white">Application Received</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg">
                    We've received your application. Our team will review your profile and reach out within 24-48 hours.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row h-full min-h-screen">
            {/* Left Panel - Context */}
            <div className="w-full md:w-5/12 bg-gray-50 dark:bg-neutral-900 border-r border-gray-100 dark:border-white/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto md:mx-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Step {step} of 2: {step === 1 ? 'Opt-in' : 'Qualification'}
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 dark:text-white">
                        {step === 1 ? 'Request Access' : 'Tell us about you'}
                    </h2>

                    <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                        {step === 1
                            ? "We only onboard qualified manufacturers and suppliers. If you believe you're a fit, leave your details and we'll review your application."
                            : "Help us understand your needs so we can route you to the right partner network."
                        }
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-black">
                <div className="max-w-lg mx-auto w-full">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleNext}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Email *</label>
                                    <input
                                        required
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                        placeholder="john@company.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Website / LinkedIn *</label>
                                    <input
                                        required
                                        type="text"
                                        id="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                        placeholder="company.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-2 group"
                                >
                                    Continue
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                                        <input
                                            required
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name *</label>
                                        <input
                                            required
                                            id="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                            placeholder="Acme Inc."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="usecase" className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Use Case</label>
                                    <textarea
                                        id="usecase"
                                        rows={4}
                                        value={formData.usecase}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all resize-none"
                                        placeholder="What are you looking to achieve?"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        disabled={isLoading}
                                        className="w-1/3 h-14 text-lg flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-2/3 btn-primary h-14 text-lg flex items-center justify-center gap-2 group"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                Submit Application
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Step {step} of 2. Your information is secure and private.
                    </p>
                </div>
            </div>
        </div>
    )
}
