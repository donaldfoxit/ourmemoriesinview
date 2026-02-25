'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FirstTouch() {
    const [hasEntered, setHasEntered] = useState(false)

    useEffect(() => {
        if (hasEntered) {
            document.body.style.overflow = 'auto'
        } else {
            // Prevent scrolling while on the welcome screen
            document.body.style.overflow = 'hidden'
        }
        return () => { document.body.style.overflow = 'auto' }
    }, [hasEntered])

    const handleEnter = () => {
        setHasEntered(true)
        // Dispatch custom event to start the ambient player
        window.dispatchEvent(new Event('start-ambient-music'))
    }

    return (
        <AnimatePresence>
            {!hasEntered && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                >
                    <motion.button
                        onClick={handleEnter}
                        className="group flex flex-col items-center cursor-pointer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Soft glowing orb */}
                        <div className="relative w-16 h-16 flex justify-center items-center mb-6">
                            <div className="absolute inset-0 bg-[var(--accent)] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
                            <div className="absolute inset-2 bg-[var(--accent)] rounded-full blur-md opacity-40" />
                            <div className="relative w-2 h-2 bg-white rounded-full" />
                        </div>

                        <span className="text-white/60 tracking-[0.4em] uppercase text-xs font-semibold group-hover:text-white transition-colors duration-500">
                            Touch to Begin
                        </span>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
