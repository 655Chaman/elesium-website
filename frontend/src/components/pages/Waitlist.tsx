import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import logo from '../../assets/ele-in-logo.png'

export default function Waitlist() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        
        setIsLoading(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://elesium-website.onrender.com'
            const response = await fetch(`${apiUrl}/api/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            }).catch(() => null)

            if (response && response.ok) {
                setSubmitted(true)
            } else {
                alert("There was an error joining the waitlist. Please try again.")
            }
        } catch (error) {
            alert("There was an error joining the waitlist. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const inputClass =
        'w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-[15px]'

    return (
        <motion.div 
            key="waitlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-[100vh] pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]"
        >
            <div className="relative z-10 w-full max-w-[480px] mx-auto flex flex-col">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Partnered with Elesium
                    </div>

                    <div className="relative w-40 h-20 md:w-48 md:h-24 mb-8 flex items-center justify-center">
                        <img 
                            src={logo} 
                            alt="ele-in Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-center tracking-tight text-gray-900 dark:text-white mb-4">
                        You provide the leads. <br className="hidden md:block" />
                        <span className="text-gray-400 dark:text-gray-500">We book the meetings.</span>
                    </h1>
                    <p className="text-[15px] text-center text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                        ele-in is an autonomous AI agent that completely takes over your LinkedIn outreach. From the first touch to the final calendar invite, we handle the entire A-to-Z process.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col space-y-4 bg-white dark:bg-black p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm"
                        >
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Work Email <span className="text-gray-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className={inputClass}
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary h-13 text-base flex items-center justify-center gap-2 group disabled:opacity-60 mt-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Secure Early Access
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-4 font-medium">
                                Confidential. No spam, ever.
                            </p>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm"
                        >
                            <div className="relative flex items-center justify-center h-20 w-20 mb-6">
                                <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-emerald-500/20 opacity-75" />
                                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
                                    <CheckCircle className="h-7 w-7" />
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase mb-4">
                                Access Granted
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">You're on the list.</h3>
                            <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                                We've reserved a spot for <strong className="text-gray-900 dark:text-white font-medium">{email}</strong>. Our team will notify you the moment we open up onboarding.
                            </p>
                            
                            {/* Terminal-style status box */}
                            <div className="w-full bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-4 text-left font-mono text-xs">
                                <div className="flex justify-between border-b border-gray-200/50 dark:border-white/5 pb-2 mb-2">
                                    <span className="text-gray-400">STATUS</span>
                                    <span className="text-emerald-500 font-semibold">WAITLISTED</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">QUEUE PRIORITY</span>
                                    <span className="text-gray-900 dark:text-white">TIER-1</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
