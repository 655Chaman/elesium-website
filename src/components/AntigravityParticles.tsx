import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    color: string
}

export default function AntigravityParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = document.documentElement.scrollHeight
        }
        setCanvasSize()
        window.addEventListener('resize', setCanvasSize)

        // Google colors - exact palette
        const colors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#9334E9']

        // Create particles (more than before for Antigravity effect)
        const particles: Particle[] = []
        const particleCount = 80

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            })
        }

        let mouseX = 0
        let mouseY = 0

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY + window.scrollY
        }

        window.addEventListener('mousemove', handleMouseMove)

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach((particle) => {
                // Mouse interaction - attract/repel
                const dx = mouseX - particle.x
                const dy = mouseY - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 150) {
                    const force = (150 - distance) / 150
                    particle.vx -= (dx / distance) * force * 0.05
                    particle.vy -= (dy / distance) * force * 0.05
                }

                // Update position
                particle.x += particle.vx
                particle.y += particle.vy

                // Gentle friction
                particle.vx *= 0.99
                particle.vy *= 0.99

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                // Keep within bounds
                particle.x = Math.max(0, Math.min(canvas.width, particle.x))
                particle.y = Math.max(0, Math.min(canvas.height, particle.y))

                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
                ctx.fillStyle = particle.color
                ctx.globalAlpha = 0.6
                ctx.fill()
                ctx.globalAlpha = 1
            })

            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', setCanvasSize)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.8 }}
        />
    )
}
