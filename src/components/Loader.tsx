'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)

    useEffect(() => {
        // Simulate progress count
        const interval = setInterval(() => {
            setCount(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                // Accelerating count
                const increment = prev < 60 ? 2 : prev < 90 ? 3 : 5
                return Math.min(prev + increment, 100)
            })
        }, 25)

        // Dismiss at end
        const timer = setTimeout(() => setLoading(false), 1800)
        return () => {
            clearInterval(interval)
            clearTimeout(timer)
        }
    }, [])

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9998]"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                    {/* Brand mark */}
                    <motion.h1
                        className="text-xs md:text-sm tracking-[0.6em] uppercase text-[var(--muted)] mb-10 select-none"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Legend Creative
                    </motion.h1>

                    {/* Progress bar track */}
                    <div className="w-48 md:w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-[var(--accent)]"
                            initial={{ width: '0%' }}
                            animate={{ width: `${count}%` }}
                            transition={{ duration: 0.1, ease: 'linear' }}
                        />
                    </div>

                    {/* Count */}
                    <motion.span
                        className="mt-5 text-xs tracking-[0.3em] text-[var(--muted)] tabular-nums font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {count}%
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
