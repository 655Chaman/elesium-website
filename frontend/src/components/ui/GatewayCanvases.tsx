import { useEffect, useRef } from 'react'

interface PointerState {
    x: number
    y: number
    active: boolean
}

interface FieldProps {
    isFocused: boolean
    isDimmed: boolean
}

/**
 * 60fps monochrome signal constellation field for the Connector division.
 * Nodes gently orbit and trace luminous monochrome hairlines toward the cursor.
 */
export function ConnectorFieldCanvas({ isFocused, isDimmed }: FieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const stateRef = useRef<PointerState>({ x: -9999, y: -9999, active: false })
    const focusRef = useRef({ focused: isFocused, dimmed: isDimmed })

    useEffect(() => {
        focusRef.current = { focused: isFocused, dimmed: isDimmed }
    }, [isFocused, isDimmed])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const parent = canvas.parentElement
        if (!parent) return

        let width = 0
        let height = 0
        let rafId = 0
        let intensity = 0.45

        interface Node {
            x: number
            y: number
            vx: number
            vy: number
            baseR: number
            phase: number
        }

        const nodes: Node[] = []
        const NODE_COUNT = 38

        const seedNodes = (w: number, h: number) => {
            nodes.length = 0
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.32,
                    vy: (Math.random() - 0.5) * 0.32,
                    baseR: Math.random() * 1.1 + 0.9,
                    phase: Math.random() * Math.PI * 2,
                })
            }
        }

        const resize = () => {
            const rect = parent.getBoundingClientRect()
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = rect.width
            height = rect.height
            canvas.width = Math.max(1, Math.floor(width * dpr))
            canvas.height = Math.max(1, Math.floor(height * dpr))
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            if (nodes.length === 0 && width > 0 && height > 0) {
                seedNodes(width, height)
            }
        }

        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(parent)

        const onMove = (e: PointerEvent) => {
            const rect = parent.getBoundingClientRect()
            stateRef.current.x = e.clientX - rect.left
            stateRef.current.y = e.clientY - rect.top
            stateRef.current.active = true
        }
        const onLeave = () => {
            stateRef.current.active = false
        }

        parent.addEventListener('pointermove', onMove, { passive: true })
        parent.addEventListener('pointerleave', onLeave, { passive: true })

        let t = 0
        const render = () => {
            t += 0.012
            const target = focusRef.current.focused ? 1 : focusRef.current.dimmed ? 0.22 : 0.48
            intensity += (target - intensity) * 0.08

            ctx.clearRect(0, 0, width, height)

            const ptr = stateRef.current

            // Specular pointer radiance
            if (ptr.active && !reduced) {
                const glow = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 240)
                glow.addColorStop(0, `rgba(255, 255, 255, ${0.075 * intensity})`)
                glow.addColorStop(0.55, `rgba(255, 255, 255, ${0.025 * intensity})`)
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
                ctx.fillStyle = glow
                ctx.fillRect(0, 0, width, height)
            }

            // Update physics
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i]
                if (!reduced) {
                    n.x += n.vx + Math.sin(t + n.phase) * 0.08
                    n.y += n.vy + Math.cos(t * 0.8 + n.phase) * 0.08

                    if (ptr.active) {
                        const dx = ptr.x - n.x
                        const dy = ptr.y - n.y
                        const dist = Math.hypot(dx, dy)
                        if (dist > 24 && dist < 210) {
                            const pull = (1 - dist / 210) * 0.018
                            n.x += dx * pull
                            n.y += dy * pull
                        }
                    }

                    if (n.x < 0) n.x = width
                    if (n.x > width) n.x = 0
                    if (n.y < 0) n.y = height
                    if (n.y > height) n.y = 0
                }
            }

            // Draw constellation chords
            const maxLink = 135
            ctx.lineWidth = 0.75
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i]
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j]
                    const d = Math.hypot(a.x - b.x, a.y - b.y)
                    if (d < maxLink) {
                        const alpha = (1 - d / maxLink) * 0.17 * intensity
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }

                // Direct conduit lines to pointer
                if (ptr.active) {
                    const pd = Math.hypot(a.x - ptr.x, a.y - ptr.y)
                    if (pd < 185) {
                        const alpha = (1 - pd / 185) * 0.34 * intensity
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(ptr.x, ptr.y)
                        ctx.stroke()
                    }
                }
            }

            // Draw nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i]
                let boost = 0
                if (ptr.active) {
                    const pd = Math.hypot(n.x - ptr.x, n.y - ptr.y)
                    if (pd < 185) boost = (1 - pd / 185) * 0.65
                }
                const alpha = Math.min(0.9, (0.28 + boost) * intensity)
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.baseR + boost * 1.1, 0, Math.PI * 2)
                ctx.fill()
            }

            if (!reduced) {
                rafId = requestAnimationFrame(render)
            }
        }

        rafId = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(rafId)
            ro.disconnect()
            parent.removeEventListener('pointermove', onMove)
            parent.removeEventListener('pointerleave', onLeave)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    )
}

/**
 * 60fps monochrome architectural wave lattice for AI & Automation.
 * Dots breathe with subtle harmonic interference and ripple cleanly under cursor motion.
 */
export function AiLatticeCanvas({ isFocused, isDimmed }: FieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const stateRef = useRef<PointerState>({ x: -9999, y: -9999, active: false })
    const focusRef = useRef({ focused: isFocused, dimmed: isDimmed })

    useEffect(() => {
        focusRef.current = { focused: isFocused, dimmed: isDimmed }
    }, [isFocused, isDimmed])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const parent = canvas.parentElement
        if (!parent) return

        let width = 0
        let height = 0
        let rafId = 0
        let intensity = 0.45

        const resize = () => {
            const rect = parent.getBoundingClientRect()
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = rect.width
            height = rect.height
            canvas.width = Math.max(1, Math.floor(width * dpr))
            canvas.height = Math.max(1, Math.floor(height * dpr))
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(parent)

        const onMove = (e: PointerEvent) => {
            const rect = parent.getBoundingClientRect()
            stateRef.current.x = e.clientX - rect.left
            stateRef.current.y = e.clientY - rect.top
            stateRef.current.active = true
        }
        const onLeave = () => {
            stateRef.current.active = false
        }

        parent.addEventListener('pointermove', onMove, { passive: true })
        parent.addEventListener('pointerleave', onLeave, { passive: true })

        let t = 0
        const spacing = 34

        const render = () => {
            t += 0.025
            const target = focusRef.current.focused ? 1 : focusRef.current.dimmed ? 0.22 : 0.48
            intensity += (target - intensity) * 0.08

            ctx.clearRect(0, 0, width, height)

            const ptr = stateRef.current

            if (ptr.active && !reduced) {
                const glow = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 240)
                glow.addColorStop(0, `rgba(255, 255, 255, ${0.075 * intensity})`)
                glow.addColorStop(0.55, `rgba(255, 255, 255, ${0.025 * intensity})`)
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
                ctx.fillStyle = glow
                ctx.fillRect(0, 0, width, height)
            }

            const cols = Math.ceil(width / spacing) + 1
            const rows = Math.ceil(height / spacing) + 1
            const offsetX = (width - (cols - 1) * spacing) / 2
            const offsetY = (height - (rows - 1) * spacing) / 2

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const bx = offsetX + c * spacing
                    const by = offsetY + r * spacing

                    const wave = reduced ? 0 : Math.sin(c * 0.35 + t) * Math.cos(r * 0.35 - t * 0.7)
                    let px = bx
                    let py = by
                    let boost = 0

                    if (ptr.active && !reduced) {
                        const dx = bx - ptr.x
                        const dy = by - ptr.y
                        const dist = Math.hypot(dx, dy)
                        if (dist < 190 && dist > 1) {
                            const factor = 1 - dist / 190
                            const ripple = Math.sin(dist * 0.06 - t * 2.2) * 3.5 * factor
                            px += (dx / dist) * ripple
                            py += (dy / dist) * ripple
                            boost = factor * 0.65
                        }
                    }

                    const alpha = Math.min(0.88, (0.14 + (wave + 1) * 0.08 + boost) * intensity)
                    const radius = 1 + (wave + 1) * 0.35 + boost * 1.1

                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                    ctx.beginPath()
                    ctx.arc(px, py, radius, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            if (!reduced) {
                rafId = requestAnimationFrame(render)
            }
        }

        rafId = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(rafId)
            ro.disconnect()
            parent.removeEventListener('pointermove', onMove)
            parent.removeEventListener('pointerleave', onLeave)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    )
}
