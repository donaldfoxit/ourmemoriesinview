'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Lenis from 'lenis'
import { memories, formatMemoryDate, type Memory } from '@/lib/memories'

// ── Season color tints ──
const seasonTint: Record<string, string> = {
    spring: 'rgba(144, 238, 144, 0.08)',
    summer: 'rgba(255, 193, 7, 0.08)',
    autumn: 'rgba(210, 105, 30, 0.08)',
    winter: 'rgba(135, 206, 235, 0.08)',
}

function MemoryCard({
    memory,
    index,
    onOpen,
}: {
    memory: Memory
    index: number
    onOpen: (memory: Memory) => void
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(cardRef, { once: true, margin: '-50px' })
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const flipIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // ── Flipbook hover ──
    const startFlipbook = useCallback(() => {
        if (memory.images.length <= 1) return
        let idx = 0
        flipIntervalRef.current = setInterval(() => {
            idx = (idx + 1) % memory.images.length
            setCurrentImageIndex(idx)
        }, 350)
    }, [memory.images])

    const stopFlipbook = useCallback(() => {
        if (flipIntervalRef.current) {
            clearInterval(flipIntervalRef.current)
            flipIntervalRef.current = null
        }
        setCurrentImageIndex(0)
    }, [])

    // ── Magnetic Cursor + 3D Tilt ──
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
        // Magnetic pull: slight translate toward cursor
        const pullX = (x - centerX) / 25
        const pullY = (y - centerY) / 25
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${pullX}px) translateY(${pullY}px) scale(1.03)`
    }, [])

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current
        if (!card) return
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
        stopFlipbook()
    }, [stopFlipbook])

    const handleMouseEnter = useCallback(() => {
        startFlipbook()
    }, [startFlipbook])

    // Cleanup
    useEffect(() => {
        return () => {
            if (flipIntervalRef.current) clearInterval(flipIntervalRef.current)
        }
    }, [])

    return (
        <motion.div
            ref={cardRef}
            className="portrait-card group cursor-pointer"
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{
                duration: 0.9,
                delay: index * 0.12,
                ease: [0.23, 1, 0.32, 1] as const,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={() => onOpen(memory)}
        >
            {/* Season color overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none rounded-xl"
                style={{ background: seasonTint[memory.season] || 'transparent' }}
            />

            {/* Image with flipbook cycling */}
            <img
                src={memory.images[currentImageIndex]}
                alt={memory.title}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover"
            />

            {/* Image count indicator */}
            <div className="absolute top-3 right-3 z-20 flex gap-1">
                {memory.images.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'
                            }`}
                    />
                ))}
            </div>

            {/* Caption overlay — handwritten font */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="font-[var(--font-caveat)] text-lg md:text-xl text-white leading-relaxed">
                    {memory.title}
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1">
                    {memory.location} · {formatMemoryDate(memory.date)}
                </p>
            </div>

            {/* Tags */}
            <div className="absolute top-3 left-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {memory.tags.slice(0, 2).map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-0.5 text-[9px] tracking-wider uppercase rounded-full bg-white/15 backdrop-blur-sm text-white/80"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}

// ── PortraitGrid ──
export default function PortraitGrid({
    onOpenMemory,
}: {
    onOpenMemory: (memory: Memory) => void
}) {
    const columnsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.08 })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

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

    // Split memories across 3 columns
    const columns: Memory[][] = [[], [], []]
    memories.forEach((m, i) => columns[i % 3].push(m))

    return (
        <section className="relative min-h-[220vh] px-6 md:px-14 py-32 overflow-hidden">
            {/* Section title */}
            <motion.div
                className="mb-16 md:mb-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] as const }}
            >
                <p className="text-xs tracking-[0.4em] uppercase text-[var(--muted)] mb-3">
                    The Collection
                </p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Moments That
                    <br />
                    <span className="text-[var(--accent)]">Made Us</span>
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
                        {col.map((memory, i) => (
                            <MemoryCard
                                key={memory.id}
                                memory={memory}
                                index={colIndex * 3 + i}
                                onOpen={onOpenMemory}
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
