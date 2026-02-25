'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Memory, formatMemoryDate } from '@/lib/memories'

export default function MemoryModal({
    memory,
    onClose,
}: {
    memory: Memory | null
    onClose: () => void
}) {
    const stripRef = useRef<HTMLDivElement>(null)

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose])

    // Lock body scroll when open
    useEffect(() => {
        if (memory) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [memory])

    return (
        <AnimatePresence>
            {memory && (
                <motion.div
                    className="fixed inset-0 z-[999] flex flex-col bg-black/95 backdrop-blur-xl overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                    {/* Close button */}
                    <motion.button
                        className="fixed top-6 right-6 md:top-8 md:right-10 z-[1000] text-white/60 hover:text-white text-sm tracking-[0.3em] uppercase transition-colors duration-300"
                        onClick={onClose}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Close ✕
                    </motion.button>

                    {/* Hero image */}
                    <motion.div
                        className="relative w-full h-[60vh] md:h-[70vh] flex-shrink-0 overflow-hidden"
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <img
                            src={memory.images[0]}
                            alt={memory.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        {/* Title overlay on hero */}
                        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-14 right-8">
                            <motion.div
                                className="flex flex-wrap gap-2 mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {memory.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-[10px] tracking-widest uppercase rounded-full bg-white/10 backdrop-blur-sm text-white/70"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </motion.div>

                            <motion.h2
                                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                {memory.title}
                            </motion.h2>

                            <motion.p
                                className="mt-3 text-xs md:text-sm tracking-[0.2em] uppercase text-white/40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                {memory.location} · {formatMemoryDate(memory.date)}
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Caption section */}
                    <motion.div
                        className="px-8 md:px-14 py-10 md:py-16 max-w-3xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                    >
                        <p className="font-[var(--font-caveat)] text-2xl md:text-3xl lg:text-4xl text-white/80 leading-relaxed">
                            &ldquo;{memory.caption}&rdquo;
                        </p>
                    </motion.div>

                    {/* Photo strip */}
                    <motion.div
                        className="px-8 md:px-14 pb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.7 }}
                    >
                        <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">
                            From this day — {memory.images.length} photos
                        </p>
                        <div
                            ref={stripRef}
                            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {memory.images.map((img, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-shrink-0 w-48 md:w-64 aspect-[4/5] rounded-lg overflow-hidden"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 + i * 0.1 }}
                                >
                                    <img
                                        src={img}
                                        alt={`${memory.title} - ${i + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
