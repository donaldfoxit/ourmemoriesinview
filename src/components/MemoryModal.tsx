'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Memory, formatMemoryDate } from '@/lib/memories'

export default function MemoryModal({
    memory,
    onClose,
}: {
    memory: Memory | null
    onClose: () => void
}) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Reset index when opening a new memory
    useEffect(() => {
        if (memory) setCurrentIndex(0)
    }, [memory])

    // Close on Escape, Navigate on Arrows
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!memory) return
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') {
                setCurrentIndex(prev => (prev + 1) % memory.images.length)
            }
            if (e.key === 'ArrowLeft') {
                setCurrentIndex(prev => (prev - 1 + memory.images.length) % memory.images.length)
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose, memory])

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
                <>
                    {/* The Film Burn / Flash overlay. Blinds the screen in pure white for a split second 
                        then fades into the pitch black focus mode. */}
                    <motion.div
                        className="fixed inset-0 z-[1000] bg-white pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6, times: [0, 0.1, 1], ease: "circOut" }}
                    />

                    <motion.div
                        className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                        // Delay the background appearing until immediately after the white flash peaks
                        transition={{ delay: 0.05, duration: 0 }}
                    >

                        {/* Global Progress Bar (Top Edge) */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-[1001]">
                            <motion.div
                                className="h-full bg-[var(--accent)]"
                                animate={{ width: `${((currentIndex + 1) / memory.images.length) * 100}%` }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                            />
                        </div>

                        {/* Top Navigation Bar */}
                        <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-[1001] pointer-events-none">

                            {/* Left: Metadata */}
                            <motion.div
                                className="flex flex-col gap-2 pointer-events-auto"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 1 }}
                            >
                                <h2 className="font-serif text-2xl md:text-4xl text-white tracking-wide">
                                    {memory.title}
                                </h2>
                                <div className="flex items-center gap-4 text-[9px] md:text-[10px] uppercase font-mono tracking-[0.2em] text-white/50">
                                    <span>{memory.location}</span>
                                    <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                                    <span>{formatMemoryDate(memory.date)}</span>
                                </div>
                            </motion.div>

                            {/* Right: Close Button */}
                            <motion.button
                                className="pointer-events-auto text-[10px] tracking-[0.3em] font-mono text-white/50 hover:text-white uppercase transition-colors"
                                onClick={onClose}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 1 }}
                            >
                                CLOSE ✕
                            </motion.button>
                        </div>

                        {/* Middle: The Carousel Engine */}
                        <div className="relative w-full h-[70vh] flex items-center justify-center">

                            {/* Previous / Next invisible click zones */}
                            <button
                                className="absolute left-0 top-0 w-1/4 h-full z-50 cursor-w-resize"
                                onClick={() => setCurrentIndex(prev => (prev - 1 + memory.images.length) % memory.images.length)}
                            />
                            <button
                                className="absolute right-0 top-0 w-1/4 h-full z-50 cursor-e-resize"
                                onClick={() => setCurrentIndex(prev => (prev + 1) % memory.images.length)}
                            />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    className="relative w-full h-full md:w-[80vw] mx-auto px-4 md:px-0 flex items-center justify-center"
                                    initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                    exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <img
                                        src={memory.images[currentIndex]}
                                        alt={`${memory.title} view ${currentIndex + 1}`}
                                        className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-2xl"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Bottom: Caption & Details */}
                        <motion.div
                            className="absolute bottom-6 md:bottom-10 left-0 w-full px-6 md:px-10 flex flex-col md:flex-row justify-between items-end z-[1001]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            <p className="font-[var(--font-caveat)] text-2xl md:text-3xl lg:text-4xl text-white/70 max-w-2xl leading-relaxed">
                                "{memory.caption}"
                            </p>

                            <div className="hidden md:flex flex-col items-end gap-2 text-right">
                                <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">
                                    Exposure {currentIndex + 1} // {memory.images.length}
                                </span>
                                <span className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest">
                                    [←] prev  ·  next [→]
                                </span>
                            </div>
                        </motion.div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
