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
            className="fixed bottom-8 right-8 z-[100] px-5 py-3 bg-[var(--accent)] text-black rounded-full text-xs font-semibold tracking-widest uppercase shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300"
            onClick={handleClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            ✦ Surprise Me
        </motion.button>
    )
}
