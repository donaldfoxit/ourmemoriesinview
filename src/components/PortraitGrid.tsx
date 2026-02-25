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

    // ── Flipbook hover — instant start, fast cycle ──
    const startFlipbook = useCallback(() => {
        if (memory.images.length <= 1) return
        let idx = 0
        // Immediately show next image on hover
        idx = 1
        setCurrentImageIndex(idx)
        flipIntervalRef.current = setInterval(() => {
            idx = (idx + 1) % memory.images.length
            setCurrentImageIndex(idx)
        }, 280)
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
                className="absolute inset-0 z-10 pointer-events-none"
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

            {/* Dark tint overlay — visible by default, vanishes on hover */}
            <div className="absolute inset-0 z-15 bg-black/40 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none" />

            {/* Title + tags overlay — bottom of card */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end items-start p-5 md:p-6 pb-6 md:pb-8 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wide leading-tight">
                    {memory.title}
                </h3>

                {/* Tag pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {memory.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-[9px] tracking-wider uppercase bg-white/10 backdrop-blur-sm text-white/80"
                        >
                            {tag}
                        </span>
                    ))}
                    <span className="px-2 py-0.5 text-[9px] tracking-wider bg-white/10 backdrop-blur-sm text-white/60 flex items-center gap-1">
                        📍 {memory.location}
                    </span>
                </div>
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
                // Alternate directions: Up, Down, Up, Down
                const isUp = i % 2 === 0
                // Massive reduction in scroll speed multiplier
                const speed = 0.03 + i * 0.015
                const dir = isUp ? -1 : 1
                col.style.transform = `translateY(${scrollY * speed * dir}px)`
            })
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            lenis.destroy()
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Split memories across 4 columns to make frames smaller
    const columns: Memory[][] = [[], [], [], []]
    memories.forEach((m, i) => columns[i % 4].push(m))

    // Duplicate heavily for infinite loop
    const dupesMap = columns.map(col => [...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col])

    return (
        <section id="memory-grid" className="relative h-[130vh] md:h-[160vh] px-10 sm:px-16 md:px-24 lg:px-32 py-24 overflow-hidden">
            {/* 4-column infinite parallax grid */}
            <div className="flex gap-4 md:gap-6 h-full max-w-[1800px] mx-auto z-0 relative">
                {columns.map((col, colIndex) => {
                    // Alternate up/down: 0=up, 1=down, 2=up, 3=down
                    const isUp = colIndex % 2 === 0
                    return (
                        <div
                            key={colIndex}
                            ref={(el) => { columnsRef.current[colIndex] = el }}
                            className="flex-1 relative h-[200%] -top-[50%] will-change-transform"
                            style={{ transition: 'transform 0.1s linear' }}
                        >
                            <motion.div
                                className="absolute top-0 left-0 w-full flex flex-col gap-4 md:gap-6"
                                animate={{ y: isUp ? ['0%', '-50%'] : ['-50%', '0%'] }}
                                // Extremerly slow duration (350s base) for a very subtle float
                                transition={{ repeat: Infinity, ease: 'linear', duration: 350 + colIndex * 50 }}
                            >
                                {dupesMap[colIndex].map((memory, i) => (
                                    <MemoryCard
                                        key={`${memory.id}-${i}`}
                                        memory={memory}
                                        index={colIndex * 4 + (i % col.length)}
                                        onOpen={onOpenMemory}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    )
                })}
            </div>

            {/* Cinematic fade masks */}
            <div className="fade-top absolute top-0 left-0 w-full h-32 md:h-64 pointer-events-none z-10 bg-gradient-to-b from-black via-black/80 to-transparent" />
            <div className="fade-bottom absolute bottom-0 left-0 w-full h-32 md:h-64 pointer-events-none z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </section>
    )
}
