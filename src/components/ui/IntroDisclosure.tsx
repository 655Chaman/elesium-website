
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, Check } from "lucide-react"

// Types
export interface IntroStep {
    title: string
    description: string
    media?: {
        type: "image" | "video"
        src: string
        alt?: string
    }
}

interface IntroDisclosureProps {
    steps: IntroStep[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onComplete?: () => void
}

export function IntroDisclosure({
    steps,
    open,
    onOpenChange,
    onComplete
}: IntroDisclosureProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [direction, setDirection] = useState(0)

    // Reset when closed/opened
    useEffect(() => {
        if (open) setCurrentStep(0)
    }, [open])

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setDirection(1)
            setCurrentStep(prev => prev + 1)
        } else {
            onComplete?.()
            onOpenChange(false)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep(prev => prev - 1)
        }
    }

    const progress = ((currentStep + 1) / steps.length) * 100

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 20 : -20,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 20 : -20,
            opacity: 0,
        }),
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] z-[101] p-4"
                    >
                        <div className="bg-white dark:bg-[#111] w-full h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-white/10">

                            {/* Left Side - Media */}
                            <div className="relative w-full md:w-1/2 bg-gray-100 dark:bg-zinc-900 overflow-hidden">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 flex items-center justify-center p-8"
                                    >
                                        {steps[currentStep].media?.type === 'video' ? (
                                            <video
                                                src={steps[currentStep].media?.src}
                                                className="w-full h-full object-cover"
                                                autoPlay muted loop playsInline
                                            />
                                        ) : (
                                            <img
                                                src={steps[currentStep].media?.src || "https://placehold.co/600x400"}
                                                alt={steps[currentStep].media?.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        )}

                                        {/* Overlay gradient for text readability if needed */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </motion.div>
                                </AnimatePresence>

                                <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                                    Step {currentStep + 1} of {steps.length}
                                </div>
                            </div>

                            {/* Right Side - Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-between bg-white dark:bg-[#0A0A0A]">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>

                                <div className="mt-8">
                                    <AnimatePresence custom={direction} mode="wait">
                                        <motion.div
                                            key={currentStep}
                                            custom={direction}
                                            variants={variants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
                                                {steps[currentStep].title}
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                                {steps[currentStep].description}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-6">
                                    {/* Progress Bar */}
                                    <div className="h-1 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-600 dark:bg-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={handleBack}
                                            disabled={currentStep === 0}
                                            className="text-sm font-medium text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            Back
                                        </button>

                                        <button
                                            onClick={handleNext}
                                            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all active:scale-95"
                                        >
                                            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            {currentStep === steps.length - 1 ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Utility class helper (if not already existing in user's codebase, I'll inline it or ensuring it's imported)
// I'll check if utility exists in next step, but for now assuming this file creation is safe.
