'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    phase: number
    speed: number
}

export default function Fireflies() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const particlesRef = useRef<Particle[]>([])
    const animFrameRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Initialize particles
        const count = 35
        particlesRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(Math.random() * 0.2 + 0.1), // Float upward
            size: Math.random() * 2.5 + 1,
            opacity: Math.random() * 0.6 + 0.2,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.005 + 0.003,
        }))

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mx = mouseRef.current.x
            const my = mouseRef.current.y

            particlesRef.current.forEach((p) => {
                // Phase-based twinkle
                p.phase += p.speed
                const twinkle = 0.5 + 0.5 * Math.sin(p.phase)
                const alpha = p.opacity * twinkle

                // Sine-wave horizontal drift
                p.x += p.vx + Math.sin(p.phase * 0.7) * 0.15
                p.y += p.vy

                // Mouse repulsion
                const dx = p.x - mx
                const dy = p.y - my
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 120) {
                    const force = (120 - dist) / 120
                    p.x += (dx / dist) * force * 2
                    p.y += (dy / dist) * force * 2
                }

                // Wrap around edges
                if (p.y < -10) p.y = canvas.height + 10
                if (p.x < -10) p.x = canvas.width + 10
                if (p.x > canvas.width + 10) p.x = -10

                // Draw glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
                gradient.addColorStop(0, `rgba(212, 165, 116, ${alpha})`)
                gradient.addColorStop(0.5, `rgba(212, 165, 116, ${alpha * 0.3})`)
                gradient.addColorStop(1, 'rgba(212, 165, 116, 0)')
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                // Draw core
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 230, 190, ${alpha})`
                ctx.fill()
            })

            animFrameRef.current = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animFrameRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-[5] pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    )
}
