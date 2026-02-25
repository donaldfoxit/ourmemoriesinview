'use client'

import { motion } from 'framer-motion'

export default function Hero() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: custom, duration: 2, ease: "easeOut" as any },
        }),
    }

    const scrollToTimeline = () => {
        document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden">

            {/* Full-bleed Background Image with Editorial Fade */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 3, ease: 'easeOut' }}
            >
                <img
                    src="/memories/sino-mart/1.webp"
                    alt="Hero Background"
                    className="w-full h-full object-cover filter grayscale-[30%] contrast-110 object-top"
                    style={{ opacity: 0.15, mixBlendMode: 'luminosity' }}
                />
                {/* Master gradients to softly blend the photo into the Museum Paper background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)] opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-transparent to-[var(--bg)] opacity-70" />
            </motion.div>

            {/* Extremely subtle ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] rounded-full opacity-[0.05] blur-[150px] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">

                {/* Tiny Pre-title */}
                <motion.div
                    className="mb-8 text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[var(--fg)]/50 font-medium"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1.5}
                >
                    A Living Archive
                </motion.div>

                {/* Massive Serif Title */}
                <motion.h1
                    className="font-serif text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-tighter text-[var(--fg)] max-w-6xl mx-auto"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1.8}
                >
                    <span className="block opacity-90">Our Memories</span>
                    <span className="block italic font-light text-[var(--accent)] opacity-80 mt-2 sm:mt-0">
                        In View
                    </span>
                </motion.h1>

                {/* Subtitle / Metadata */}
                <motion.div
                    className="mt-12 md:mt-16 flex items-center gap-6 text-[var(--fg)]/60 text-[10px] md:text-xs tracking-[0.2em] uppercase"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={2.2}
                >
                    <span>Vol. 1</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-50" />
                    <span>2024 Collection</span>
                </motion.div>

                {/* Scroll Indicator (Replaced CTA button with sleek scroll prompt) */}
                <motion.button
                    onClick={scrollToTimeline}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={3.5}
                >
                    <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--fg)]/40 group-hover:text-[var(--accent)] transition-colors duration-500">
                        Scroll to begin
                    </span>
                    <div className="w-[1px] h-12 bg-[var(--fg)]/10 relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-[var(--accent)]"
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 2 }}
                        />
                    </div>
                </motion.button>
            </div>
        </section>
    )
}
