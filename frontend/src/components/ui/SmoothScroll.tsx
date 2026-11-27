import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const isTouchOrSmall =
            window.matchMedia('(pointer: coarse)').matches ||
            window.innerWidth < 1024
        const prefersReducedMotion =
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // Keep native touch scrolling untouched on mobile/touch or reduced-motion
        if (isTouchOrSmall || prefersReducedMotion) {
            return
        }

        const lenis = new Lenis({
            duration: 1.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })

        let rafId = 0
        let isActive = true

        function raf(time: number) {
            if (!isActive) return
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
        }

        rafId = requestAnimationFrame(raf)

        return () => {
            isActive = false
            cancelAnimationFrame(rafId)
            lenis.destroy()
        }
    }, [])

    return null
}
