import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react'
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

    return (
        <motion.div 
            key="waitlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-[100vh] pt-24 pb-16 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black"
        >
            {/* Background effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="relative w-48 h-24 md:w-56 md:h-28 mb-10 flex items-center justify-center">
                        <img 
                            src={logo} 
                            alt="ele-in Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-8 backdrop-blur-md shadow-sm">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-black/80 dark:text-white/80 tracking-wide">
                            Partnered with Elesium.online
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tight text-black dark:text-white mb-6">
                        You provide the leads. <br className="hidden md:block" />
                        <span className="text-emerald-500">We book the meetings.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-center text-black/60 dark:text-white/60 max-w-xl leading-relaxed">
                        ele-in is an autonomous AI agent that completely takes over your LinkedIn outreach. From the first touch to the final calendar invite, we handle the entire A-to-Z process. Your only job is to show up and close.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="w-full max-w-md relative"
                        >
                            <div className="relative flex flex-col sm:flex-row items-center gap-3 p-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full shadow-lg">
                                <div className="relative w-full">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address..."
                                        className="w-full h-12 pl-5 pr-4 rounded-full bg-transparent text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none transition-all"
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto h-12 px-8 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 whitespace-nowrap shadow-md"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Join Waitlist
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-center text-black/40 dark:text-white/40 mt-6 font-medium">
                                Secure your early access. No spam, ever.
                            </p>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center p-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl w-full max-w-md text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/20">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-3 tracking-tight">You're on the list!</h3>
                            <p className="text-black/60 dark:text-white/60 leading-relaxed">
                                We'll notify <strong className="font-semibold text-black dark:text-white">{email}</strong> as soon as we're ready to onboard you.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
