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
    const [currentImage, setCurrentImage] = useState(0)

    // Collect all cover images (first image from each memory)
    const coverImages = memories.map(m => m.images[0])

    // Cycle through cover images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(prev => (prev + 1) % coverImages.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [coverImages.length])

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
                {/* Animated photo frame — cycles through memory covers */}
                <motion.div
                    className="mb-10 md:mb-14 relative"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.2}
                >
                    {/* Warm glow behind frame */}
                    <div className="absolute -inset-6 bg-[var(--accent)] opacity-[0.08] blur-3xl rounded-full" />

                    {/* The frame itself */}
                    <motion.div
                        className="relative w-52 h-52 md:w-72 md:h-72 overflow-hidden shadow-2xl border border-white/10"
                        animate={{ rotateY: [0, 2, 0, -2, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImage}
                                src={coverImages[currentImage]}
                                alt="Memory preview"
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                            />
                        </AnimatePresence>

                        {/* Subtle inner border glow */}
                        <div className="absolute inset-0 border border-white/5" />
                    </motion.div>

                    {/* Image count dots */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {coverImages.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentImage ? 'bg-[var(--accent)] scale-125' : 'bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
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
