'use client'

import { motion } from 'framer-motion'
import { memories, type Memory } from '@/lib/memories'

export default function SurpriseMe({
    onSurprise,
}: {
    onSurprise: (memory: Memory) => void
}) {
    const handleClick = () => {
        const random = memories[Math.floor(Math.random() * memories.length)]
        onSurprise(random)
    }

    return (
        <motion.button
            className="fixed bottom-8 right-8 z-[100] group flex items-center gap-3 px-6 py-4 bg-white/[0.06] backdrop-blur-xl border border-white/10 text-[var(--fg)] text-xs font-bold tracking-[0.2em] uppercase shadow-2xl hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] transition-all duration-500"
            onClick={handleClick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Pulsing glow dot */}
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 group-hover:bg-black" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent)] group-hover:bg-black" />
            </span>
            Surprise Me
        </motion.button>
    )
}
