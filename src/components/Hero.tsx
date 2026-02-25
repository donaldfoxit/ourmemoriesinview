'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Fireflies from './Fireflies'
import { memories } from '@/lib/memories'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            delay,
            ease: [0.23, 1, 0.32, 1] as const,
        },
    }),
}

export default function Hero() {
    // Collect all cover images (first image from each memory)
    const coverImages = memories.map(m => m.images[0])

    // We duplicate the images so they can loop infinitely
    const filmStripImages = [...coverImages, ...coverImages, ...coverImages]

    const scrollToGrid = () => {
        const grid = document.getElementById('memory-grid')
        if (grid) grid.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background layer */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute inset-0 bg-black" />
                <img
                    src="/hero-bg.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-40 transition-opacity duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Floating fireflies */}
            <Fireflies />

            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent)] rounded-full opacity-[0.04] blur-[150px] pointer-events-none" />

            {/* Content — centered */}
            <div className="relative z-10 flex flex-col items-center text-center px-8">
                {/* Horizontal Film Strip — Made extremely minimal with clear margins */}
                <motion.div
                    className="mb-8 relative w-[calc(100vw-48px)] md:w-[50vw] max-w-2xl h-16 md:h-20 overflow-hidden"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.2}
                >
                    {/* The infinite scrolling track */}
                    <motion.div
                        className="flex gap-4 h-full absolute top-0 left-0"
                        animate={{ x: ['0%', '-33.333%'] }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
                    >
                        {filmStripImages.map((src, i) => (
                            <div key={i} className="relative w-24 md:w-32 h-full shrink-0">
                                <img
                                    src={src}
                                    alt="Memory"
                                    className="w-full h-full object-cover grayscale-[30%] contrast-125 sepia-[0.1]"
                                />
                                {/* Film style border overlay */}
                                <div className="absolute inset-0 border border-white/10" />
                            </div>
                        ))}
                    </motion.div>

                    {/* Left and Right Edge Fades (blend into background) */}
                    <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-[#080808] to-transparent pointer-events-none z-10" />
                    <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-[#080808] to-transparent pointer-events-none z-10" />

                    {/* Subtle warm glow behind the whole strip */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-10 bg-[var(--accent)] opacity-[0.05] blur-3xl rounded-full -z-10" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--fg)]"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.5}
                >
                    Our Memories
                    <br />
                    <span className="hero-shimmer">In View</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="mt-5 text-sm md:text-base text-[var(--muted)] tracking-wide max-w-sm"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.8}
                >
                    A living gallery of the moments that made us, us.
                </motion.p>

                {/* View Memories button — redesigned as a prominent, glowing CTA */}
                <motion.button
                    onClick={scrollToGrid}
                    className="mt-10 md:mt-14 group relative px-10 py-4 text-sm tracking-[0.2em] uppercase font-bold overflow-hidden"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1.1}
                >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-105" />
                    {/* Shine sweep on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <span className="relative z-10 text-black">View Memories</span>
                </motion.button>
            </div>
        </section>
    )
}
