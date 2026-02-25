'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import { memories, type Memory, formatMemoryDate } from '@/lib/memories'

/**
 * Cinematic Memory Card
 * Takes up almost the entire screen width. Features massive background text and intense parallax.
 */
function CinematicMemory({
    memory,
    index,
    onOpen
}: {
    memory: Memory
    index: number
    onOpen: (memory: Memory) => void
}) {
    const isEven = index % 2 === 0

    return (
        <motion.div
            className="group relative w-[85vw] md:w-[70vw] h-[75vh] md:h-[85vh] shrink-0 mx-4 md:mx-12 flex flex-col justify-center"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Massive Background Typography (Index Number) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] md:text-[20vw] font-serif font-black text-white/[0.03] select-none pointer-events-none z-0">
                0{index + 1}
            </div>

            {/* The Image Wrapper */}
            <div
                className={`relative w-full md:w-[80%] h-[60%] md:h-[80%] z-10 overflow-hidden cursor-pointer ${isEven ? 'self-start' : 'self-end'}`}
                onClick={() => onOpen(memory)}
            >
                <img
                    src={memory.images[0]}
                    alt={memory.title}
                    className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.1] grayscale-[0.2] transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:brightness-100 group-hover:grayscale-0"
                />

                {/* Thin border frame */}
                <div className="absolute inset-0 border border-white/20 pointer-events-none" />

                {/* Hover Tint */}
                <div className="absolute inset-0 bg-black/40 transition-colors duration-700 group-hover:bg-transparent pointer-events-none" />
            </div>

            {/* Meta Data Overlay */}
            <div className={`absolute z-20 flex flex-col gap-2 pointer-events-none ${isEven ? 'bottom-[10%] right-[10%] text-right' : 'top-[10%] left-[10%] text-left'}`}>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl !leading-[1.1] text-white">
                    {memory.title}
                </h2>

                <div className="flex flex-col gap-1 mt-4">
                    <p className="text-[9px] md:text-[11px] tracking-[0.2em] uppercase text-white/50 font-mono">
                        LOC // {memory.location}
                    </p>
                    <p className="text-[9px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--accent)] font-mono">
                        DATE // {formatMemoryDate(memory.date)}
                    </p>
                </div>
            </div>

            {/* Click to open text */}
            <div className={`absolute z-20 ${isEven ? 'bottom-0 left-0' : 'bottom-0 right-0'}`}>
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white/60">
                    Click to view archive
                </span>
            </div>
        </motion.div>
    )
}

export default function PortraitGrid({
    onOpenMemory,
}: {
    onOpenMemory: (memory: Memory) => void
}) {
    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.05, smoothWheel: true })
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
        return () => lenis.destroy()
    }, [])

    // The target container that will scroll horizontally
    const targetRef = useRef<HTMLDivElement>(null)

    // We use Framer Motion's useScroll to track the progress of the target element crossing the viewport
    const { scrollYProgress } = useScroll({
        target: targetRef,
        // Start the progress when the top of the target hits the top of the viewport
        // End the progress when the bottom of the target hits the bottom of the viewport
        offset: ["start start", "end end"]
    })

    // Map the vertical scroll progress (0 to 1) to horizontal translation (0% to -X%)
    // The translation distance depends on however many memories there are. 
    // We roughly translate to -(100% - 100vw) so the last item stops at the right edge.
    // We use a custom string interpolation for the x transform since we are moving the inner track.
    const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"])

    return (
        // The outer container sets the total scroll height. E.g., 500vh means the user has to scroll 5 screen heights to get through the timeline.
        <section ref={targetRef} id="timeline" className="relative h-[600vh] bg-black">

            {/* The sticky container holds the visible view while scrolling */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">

                {/* 
                    This is the massive horizontal track. 
                    It flexes row, and we move it negatively on the X axis based on scroll.
                */}
                <motion.div
                    style={{ x: xTransform }}
                    className="flex gap-8 md:gap-32 px-[10vw] min-w-max h-full items-center"
                >
                    {memories.map((memory, i) => (
                        <CinematicMemory
                            key={memory.id}
                            memory={memory}
                            index={i}
                            onOpen={onOpenMemory}
                        />
                    ))}

                    {/* End Sequence / Tail */}
                    <div className="w-[30vw] flex flex-col items-center justify-center shrink-0 pr-[10vw]">
                        <div className="w-1 h-32 bg-white/10 mb-8" />
                        <span className="font-serif text-3xl italic text-white/40">To be continued...</span>
                    </div>
                </motion.div>

            </div>

            {/* Cinematic Fade Masks (Optional, frames the edges) */}
            <div className="fixed top-0 left-0 w-32 h-screen pointer-events-none z-50 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="fixed top-0 right-0 w-32 h-screen pointer-events-none z-50 bg-gradient-to-l from-black via-black/80 to-transparent" />

        </section>
    )
}
