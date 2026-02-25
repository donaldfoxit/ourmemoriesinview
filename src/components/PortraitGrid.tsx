'use client'

import { useRef, useEffect } from 'react'
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
    return (
        <div
            className="group relative w-full aspect-[3/4] overflow-hidden cursor-pointer"
            onClick={() => onOpen(memory)}
        >
            <img
                src={memory.images[0]}
                alt={memory.title}
                className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] grayscale-[0.2] transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
            />

            {/* Hover Tint - vanishes on hover */}
            <div className="absolute inset-0 bg-black/40 transition-colors duration-700 group-hover:bg-transparent pointer-events-none" />

            {/* Internal Frame Border */}
            <div className="absolute inset-2 border border-white/10 pointer-events-none" />

            {/* Permanent Metadata Overlay - Very editorial/technical */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-1 pointer-events-none">
                <h3 className="font-serif text-lg md:text-xl font-bold text-white tracking-wide !leading-tight opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                    {memory.title}
                </h3>

                <div className="flex justify-between items-end mt-2 opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                    <p className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase text-white font-mono break-words max-w-[70%]">
                        LOC: {memory.location}
                    </p>
                    <p className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase text-[var(--accent)] font-mono text-right">
                        {formatMemoryDate(memory.date)}
                    </p>
                </div>
            </div>

            {/* Ghost Index Number */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-white/30 group-hover:text-[var(--accent)] transition-colors duration-500">
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

    // Lenis Smooth Scroll Setup
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.05, // Heavy, expensive feel
            smoothWheel: true,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Parallax Logic
        const handleScroll = () => {
            const scrollY = window.scrollY
            columnsRef.current.forEach((col, i) => {
                if (!col) return
                // Alternate directions: Up, Down, Up, Down
                const isUp = i % 2 === 0
                // Very slow, weighty parallax speed
                const speed = 0.02 + i * 0.015
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

    // Split memories across 4 columns
    const columns: Memory[][] = [[], [], [], []]
    memories.forEach((m, i) => columns[i % 4].push(m))

    // Duplicate heavily for infinite scroll illusion
    const dupesMap = columns.map(col => [...col, ...col, ...col, ...col, ...col, ...col])

    return (
        <section id="timeline" className="relative h-[150vh] md:h-[200vh] px-8 sm:px-12 md:px-24 lg:px-32 py-32 overflow-hidden bg-black flex justify-center">

            {/* Massive Background Typography - scrolls fast downward to create extreme depth */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pointer-events-none select-none z-0"
                initial={{ y: 0 }}
                animate={{ y: "20%" }}
                transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
            >
                <div className="font-serif text-[35vw] font-black text-white/[0.015] leading-[0.7] whitespace-nowrap">
                    ARCHIVE
                </div>
                <div className="font-serif text-[35vw] font-black text-white/[0.02] leading-[0.7] whitespace-nowrap mt-4 italic">
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
            <div className="fixed top-0 left-0 w-full h-40 md:h-64 pointer-events-none z-40 bg-gradient-to-b from-black via-black/90 to-transparent" />
            <div className="fixed bottom-0 left-0 w-full h-40 md:h-64 pointer-events-none z-40 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </section>
    )
}
