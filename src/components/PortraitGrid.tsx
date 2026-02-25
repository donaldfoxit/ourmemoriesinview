'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import { memories, type Memory, formatMemoryDate } from '@/lib/memories'

/**
 * High-End Editorial Memory Card
 * Smaller cards to emphasize negative space. Raw metadata text overlay.
 */
function MemoryCard({
    memory,
    index,
    onOpen
}: {
    memory: Memory
    index: number
    onOpen: (memory: Memory) => void
}) {
    const [isHovered, setIsHovered] = useState(false)
    const [imgIndex, setImgIndex] = useState(0)

    useEffect(() => {
        if (!isHovered) {
            setImgIndex(0)
            return
        }

        const interval = setInterval(() => {
            setImgIndex(prev => (prev + 1) % memory.images.length)
        }, 150) // Fast 150ms cycle for stop-motion feel

        return () => clearInterval(interval)
    }, [isHovered, memory.images.length])

    return (
        <div
            className="group relative w-full aspect-[3/4] overflow-hidden cursor-pointer"
            onClick={() => onOpen(memory)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={memory.images[imgIndex]}
                alt={memory.title}
                className="w-full h-full object-cover filter brightness-110 contrast-125 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-100"
            />

            {/* Themed Duotone Overlay (Amber/Sepia) - reveals original on hover */}
            <div className="absolute inset-0 bg-[var(--accent)] mix-blend-color opacity-100 transition-opacity duration-700 group-hover:opacity-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[var(--accent)] mix-blend-multiply opacity-40 transition-opacity duration-700 group-hover:opacity-0 pointer-events-none" />

            {/* Subtle Vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/60 via-transparent to-[var(--accent)]/20 opacity-80 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

            {/* Hover Tint - vanishes on hover (Lightened for bright theme) */}
            <div className="absolute inset-0 bg-[var(--accent)]/15 transition-colors duration-700 group-hover:bg-transparent pointer-events-none" />

            {/* Internal Frame Border */}
            <div className="absolute inset-2 border border-[var(--fg)]/10 pointer-events-none" />

            {/* Permanent Metadata Overlay - Very editorial/technical */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-1 pointer-events-none">
                <h3 className="font-serif text-lg md:text-xl font-bold text-[var(--fg)] tracking-wide !leading-tight opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                    {memory.title}
                </h3>

                <div className="flex justify-between items-end mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase text-[var(--fg)] font-mono break-words max-w-[70%]">
                        LOC: {memory.location}
                    </p>
                    <p className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase text-[var(--accent)] font-mono text-right font-bold">
                        {formatMemoryDate(memory.date)}
                    </p>
                </div>
            </div>

            {/* Ghost Index Number */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-[var(--fg)]/40 group-hover:text-[var(--accent)] transition-colors duration-500">
                NO. 0{index + 1}
            </div>
        </div>
    )
}

/**
 * 4-Column Cinematic Archival Grid
 */
export default function PortraitGrid({
    onOpenMemory,
}: {
    onOpenMemory: (memory: Memory) => void
}) {
    const columnsRef = useRef<(HTMLDivElement | null)[]>([])

    // Lenis Smooth Scroll Setup + Infinite Auto-Scroll
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.05, // Heavy, expensive feel
            smoothWheel: true,
        })

        let autoScroll = 0
        let lastTime = performance.now()
        let rafId: number

        function raf(time: number) {
            lenis.raf(time)

            // Auto-drift logic: slow, continuous movement
            const dt = time - lastTime
            autoScroll += dt * 0.035 // Adjust speed here
            lastTime = time

            // Parallax Logic combined with Auto-drift
            const scrollY = window.scrollY
            columnsRef.current.forEach((col, i) => {
                if (!col) return
                const isUp = i % 2 === 0
                const speed = 0.02 + i * 0.015
                const dir = isUp ? -1 : 1

                // Final translation is the user's manual scroll + automatic drift
                const totalMove = (scrollY + autoScroll) * speed * dir
                col.style.transform = `translateY(${totalMove}px)`
            })

            rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [])

    // Split memories across 4 columns
    const columns: Memory[][] = [[], [], [], []]
    memories.forEach((m, i) => columns[i % 4].push(m))

    // Duplicate EXTREMELY heavily for true infinite auto-scroll illusion 
    // (enough cards to drift for a very long time without running out)
    const dupesMap = columns.map(col => Array(25).fill(col).flat())

    return (
        <section id="timeline" className="relative h-[150vh] md:h-[200vh] px-8 sm:px-12 md:px-24 lg:px-32 py-32 overflow-hidden bg-[var(--bg)] flex justify-center">

            {/* Massive Background Typography - scrolls fast downward to create extreme depth */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pointer-events-none select-none z-0"
                initial={{ y: 0 }}
                animate={{ y: "20%" }}
                transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
            >
                <div className="font-serif text-[35vw] font-black text-[var(--fg)]/[0.03] leading-[0.7] whitespace-nowrap">
                    ARCHIVE
                </div>
                <div className="font-serif text-[35vw] font-black text-[var(--fg)]/[0.04] leading-[0.7] whitespace-nowrap mt-4 italic">
                    <span className="text-[var(--accent)]">20</span>24
                </div>
            </motion.div>

            {/* 4-column infinite parallax grid (The Gallery Frames) */}
            <div className="flex gap-4 md:gap-8 h-full w-full max-w-[1400px] z-10 relative">
                {columns.map((col, colIndex) => {
                    const isUp = colIndex % 2 === 0
                    return (
                        <div
                            key={colIndex}
                            ref={(el) => { columnsRef.current[colIndex] = el }}
                            className="flex-1 relative h-[200%] -top-[50%] will-change-transform"
                            style={{ transition: 'transform 0.1s linear' }}
                        >
                            <motion.div
                                className="absolute top-0 left-0 w-full flex flex-col gap-8 md:gap-16"
                                animate={{ y: isUp ? ['0%', '-50%'] : ['-50%', '0%'] }}
                                // Slowest column floats leisurely
                                transition={{ repeat: Infinity, ease: 'linear', duration: 400 + colIndex * 50 }}
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

            {/* Deep Cinematic Fade Masks (top and bottom cuts) */}
            <div className="fixed top-0 left-0 w-full h-40 md:h-64 pointer-events-none z-40 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/90 to-transparent" />
            <div className="fixed bottom-0 left-0 w-full h-40 md:h-64 pointer-events-none z-40 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/90 to-transparent" />
        </section>
    )
}
