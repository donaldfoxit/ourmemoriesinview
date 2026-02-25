'use client'

import { useEffect, useRef } from 'react'

interface Point {
    x: number
    y: number
    age: number
}

export default function GoldenThread() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointsRef = useRef<Point[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animRef = useRef<number>(0)

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

        let lastX = -1000
        let lastY = -1000

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX
            const y = e.clientY
            mouseRef.current = { x, y }

            // Only add point if mouse moved enough
            const dx = x - lastX
            const dy = y - lastY
            if (dx * dx + dy * dy > 16) {
                pointsRef.current.push({ x, y, age: 0 })
                if (pointsRef.current.length > 60) {
                    pointsRef.current.shift()
                }
                lastX = x
                lastY = y
            }
        }
        window.addEventListener('mousemove', handleMouseMove)

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const pts = pointsRef.current

            // Age all points
            for (let i = pts.length - 1; i >= 0; i--) {
                pts[i].age += 0.02
                if (pts[i].age >= 1) {
                    pts.splice(i, 1)
                }
            }

            if (pts.length < 2) {
                animRef.current = requestAnimationFrame(draw)
                return
            }

            // Draw the golden thread
            ctx.beginPath()
            ctx.moveTo(pts[0].x, pts[0].y)

            for (let i = 1; i < pts.length; i++) {
                const prev = pts[i - 1]
                const curr = pts[i]
                const midX = (prev.x + curr.x) / 2
                const midY = (prev.y + curr.y) / 2
                ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
            }

            // Stroke with gradient opacity
            const alpha = 0.4
            ctx.strokeStyle = `rgba(200, 200, 215, ${alpha})`
            ctx.lineWidth = 1.0
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.stroke()

            // Draw fading head glow at current mouse position
            if (pts.length > 0) {
                const head = pts[pts.length - 1]
                const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8)
                glow.addColorStop(0, 'rgba(200, 200, 215, 0.3)')
                glow.addColorStop(1, 'rgba(200, 200, 215, 0)')
                ctx.beginPath()
                ctx.arc(head.x, head.y, 8, 0, Math.PI * 2)
                ctx.fillStyle = glow
                ctx.fill()
            }

            animRef.current = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[9998] pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    )
}
