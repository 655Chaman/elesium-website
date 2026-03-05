import { motion } from 'framer-motion'
import logo from '../../Assets/LOGO_NEW.png'

export default function Preloader() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col items-center gap-6"
            >
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <img
                        src={logo}
                        alt="Elesium"
                        className="h-12 md:h-16 w-auto object-contain drop-shadow-sm"
                    />
                </motion.div>
                <div className="h-[2px] w-32 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    />
                </div>
            </motion.div>
        </div>
    )
}
