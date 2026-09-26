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
        <div className="relative min-h-[100vh] pt-24 pb-16 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
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
                    <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 rounded-[2.5rem] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-2xl flex items-center justify-center overflow-hidden p-6 ring-1 ring-black/5 dark:ring-white/10 transition-all hover:scale-105 duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent opacity-50" />
                        <img 
                            src={logo} 
                            alt="ele-in Logo" 
                            className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                        />
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-8 backdrop-blur-md shadow-sm">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-black/80 dark:text-white/80 tracking-wide">
                            Partnered with Elesium.online
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-center tracking-tight text-black dark:text-white mb-6">
                        ele-in
                    </h1>
                    <p className="text-lg md:text-xl text-center text-black/60 dark:text-white/60 max-w-lg leading-relaxed">
                        The next generation of autonomous digital experiences. Join the waitlist to secure early access.
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
                                By joining, you agree to receive updates about ele-in. No spam, ever.
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
                                We'll notify <strong className="font-semibold text-black dark:text-white">{email}</strong> as soon as we're ready for you.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
