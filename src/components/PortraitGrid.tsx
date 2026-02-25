'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Lenis from 'lenis'

const images = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=600&q=80',
    'https://images.unsplash.com/photo-1541534401786-2077eed87a74?w=600&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80',
]

function PortraitCard({ src, index }: { src: string; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(cardRef, { once: true, margin: '-50px' })

    // 3D tilt on mouse interaction
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current
        if (!card) return

        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = -(y - centerY) / 18
        const rotateY = (x - centerX) / 18

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
    }, [])

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current
        if (!card) return
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
    }, [])

    return (
        <motion.div
            ref={cardRef}
            className="portrait-card"
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{
                duration: 0.9,
                delay: index * 0.12,
                ease: [0.23, 1, 0.32, 1],
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={src}
                alt={`Portrait ${index + 1}`}
                loading="lazy"
                draggable={false}
            />
        </motion.div>
    )
}

export default function PortraitGrid() {
    const columnsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        // Lenis smooth scroll instance
        const lenis = new Lenis({ lerp: 0.08 })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Parallax column drift on scroll
        const handleScroll = () => {
            const scrollY = window.scrollY
            columnsRef.current.forEach((col, i) => {
                if (!col) return
                const speed = 0.04 + i * 0.025
                col.style.transform = `translateY(${scrollY * speed}px)`
            })
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            lenis.destroy()
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Split images across 3 columns
    const columns = [
        images.slice(0, 3),
        images.slice(3, 6),
        images.slice(6, 9),
    ]

    return (
        <section className="relative min-h-[220vh] px-6 md:px-14 py-32 overflow-hidden">
            {/* Section title */}
            <motion.div
                className="mb-16 md:mb-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
                <p className="text-xs tracking-[0.4em] uppercase text-[var(--muted)] mb-3">
                    Our Legends
                </p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    The Faces Behind
                    <br />
                    <span className="text-[var(--accent)]">The Craft</span>
                </h2>
            </motion.div>

            {/* 3-column parallax grid */}
            <div className="flex gap-6 md:gap-10">
                {columns.map((col, colIndex) => (
                    <div
                        key={colIndex}
                        ref={(el) => { columnsRef.current[colIndex] = el }}
                        className="flex-1 flex flex-col gap-6 md:gap-10 will-change-transform"
                        style={{ transition: 'transform 0.1s linear' }}
                    >
                        {col.map((src, i) => (
                            <PortraitCard
                                key={`${colIndex}-${i}`}
                                src={src}
                                index={colIndex * 3 + i}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Cinematic fade masks */}
            <div className="fade-top absolute top-0 left-0 w-full h-40 pointer-events-none z-10" />
            <div className="fade-bottom absolute bottom-0 left-0 w-full h-40 pointer-events-none z-10" />
        </section>
    )
}
