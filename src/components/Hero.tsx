'use client'
import { motion } from 'framer-motion'
import Fireflies from './Fireflies'

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
                {/* Small framed Ghibli art */}
                <motion.div
                    className="mb-10 md:mb-14"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.2}
                >
                    <div className="relative w-48 h-48 md:w-64 md:h-64 overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src="/hero-bg.jpg"
                            alt="Our Memories"
                            className="w-full h-full object-cover"
                        />
                        {/* Subtle warm glow behind the frame */}
                        <div className="absolute -inset-4 bg-[var(--accent)] opacity-[0.08] blur-3xl -z-10 rounded-full" />
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

                {/* View Memories button */}
                <motion.button
                    onClick={scrollToGrid}
                    className="mt-10 md:mt-14 px-8 py-3 text-xs tracking-[0.3em] uppercase font-semibold text-[var(--fg)] border border-white/15 bg-white/5 backdrop-blur-sm hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] transition-all duration-500 hover:scale-[1.04] active:scale-[0.97]"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1.1}
                >
                    View Memories
                </motion.button>
            </div>
        </section>
    )
}
