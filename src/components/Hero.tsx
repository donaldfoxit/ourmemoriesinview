'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { daysSince } from '@/lib/memories'

// ── Set your anniversary date here ──
const ANNIVERSARY_DATE = '2023-10-12'

const headlineVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.4,
        },
    },
}

const wordVariant = {
    hidden: { y: '110%', rotateX: -30 },
    visible: {
        y: '0%',
        rotateX: 0,
        transition: {
            duration: 1.1,
            ease: [0.23, 1, 0.32, 1] as const,
        },
    },
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9,
            delay,
            ease: [0.23, 1, 0.32, 1] as const,
        },
    }),
}

export default function Hero() {
    const [days, setDays] = useState(0)

    useEffect(() => {
        setDays(daysSince(ANNIVERSARY_DATE))
    }, [])

    return (
        <section className="relative h-screen flex items-end pb-24 md:pb-32 px-8 md:px-14 overflow-hidden">
            {/* Cinematic Background Image */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                {/* Fallback color if image is missing */}
                <div className="absolute inset-0 bg-black" />
                <img
                    src="/hero-bg.jpg"
                    alt="Hero Background"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-60 mix-blend-screen transition-opacity duration-1000"
                />
                {/* Vignette and blend gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-black/20" />
            </div>
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[var(--accent)] rounded-full opacity-[0.03] blur-[180px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl">
                {/* Eyebrow */}
                <motion.p
                    className="text-xs md:text-sm tracking-[0.4em] uppercase text-[var(--muted)] mb-6 md:mb-8"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.2}
                >
                    A living gallery
                </motion.p>

                {/* Headline */}
                <motion.h1
                    className="text-[clamp(2.8rem,8vw,7rem)] font-extrabold leading-[0.9] tracking-tight"
                    variants={headlineVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {['Our', 'Memories'].map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
                            <motion.span className="inline-block" variants={wordVariant}>
                                {word}
                            </motion.span>
                        </span>
                    ))}
                    <br />
                    <span className="inline-block overflow-hidden">
                        <motion.span className="inline-block hero-shimmer" variants={wordVariant}>
                            In View
                        </motion.span>
                    </span>
                </motion.h1>

            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 right-8 md:right-14 flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] [writing-mode:vertical-lr]">
                    Scroll
                </span>
                <motion.div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 w-full bg-[var(--accent)]"
                        animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}
