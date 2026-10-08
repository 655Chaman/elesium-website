import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';

// TODO: Update CALENDLY_URL constant with your actual Calendly link
const CALENDLY_URL = 'https://calendly.com/elesium/ai-audit';

interface CalendlyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CalendlyModal = ({ isOpen, onClose }: CalendlyModalProps) => {
    useEffect(() => {
        if (isOpen) {
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            document.body.appendChild(script);

            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';

            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl h-[90vh] md:h-[800px] bg-white dark:bg-[#111] rounded-2xl md:rounded-[40px] shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 z-10 flex flex-col m-4 md:m-0"
                    >
                        <div className="flex justify-end p-4 absolute top-0 right-0 z-20 w-full bg-gradient-to-b from-white/80 dark:from-[#111]/80 to-transparent pointer-events-none">
                            <button 
                                onClick={onClose}
                                className="p-2 rounded-full bg-gray-100/80 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors pointer-events-auto backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-12 md:pt-16 pb-4 bg-white dark:bg-[#111]">
                            <div 
                                className="calendly-inline-widget w-full h-full min-h-[700px]" 
                                data-url={CALENDLY_URL}
                                style={{ minWidth: '320px', height: '100%' }}
                            ></div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
