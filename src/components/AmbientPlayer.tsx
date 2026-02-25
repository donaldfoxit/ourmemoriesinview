'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Royalty-free ambient track — replace with your own song URL
const AMBIENT_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'

export default function AmbientPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [playing, setPlaying] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.volume = 0
        audio.loop = true

        const handleCanPlay = () => setReady(true)
        audio.addEventListener('canplaythrough', handleCanPlay)
        return () => audio.removeEventListener('canplaythrough', handleCanPlay)
    }, [])

    useEffect(() => {
        const handleStartEvent = () => {
            if (!playing) toggle()
        }
        window.addEventListener('start-ambient-music', handleStartEvent)
        return () => window.removeEventListener('start-ambient-music', handleStartEvent)
    }, [playing])

    const toggle = () => {
        const audio = audioRef.current
        if (!audio) return

        if (playing) {
            // Fade out
            const fadeOut = setInterval(() => {
                if (audio.volume > 0.05) {
                    audio.volume = Math.max(0, audio.volume - 0.05)
                } else {
                    audio.volume = 0
                    audio.pause()
                    clearInterval(fadeOut)
                }
            }, 50)
            setPlaying(false)
        } else {
            audio.play()
            // Fade in
            const fadeIn = setInterval(() => {
                if (audio.volume < 0.3) {
                    audio.volume = Math.min(0.3, audio.volume + 0.02)
                } else {
                    clearInterval(fadeIn)
                }
            }, 50)
            setPlaying(true)
        }
    }

    return (
        <>
            <audio ref={audioRef} src={AMBIENT_URL} preload="auto" />

            <motion.button
                className="fixed bottom-8 left-8 z-[100] flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/10 transition-all duration-300"
                onClick={toggle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                {/* Animated equalizer bars */}
                <div className="flex items-end gap-[2px] h-3">
                    {[1, 2, 3, 4].map((bar) => (
                        <motion.div
                            key={bar}
                            className="w-[2px] bg-current rounded-full"
                            animate={
                                playing
                                    ? {
                                        height: ['4px', '12px', '6px', '10px', '4px'],
                                    }
                                    : { height: '4px' }
                            }
                            transition={
                                playing
                                    ? {
                                        duration: 0.8 + bar * 0.15,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }
                                    : { duration: 0.3 }
                            }
                        />
                    ))}
                </div>

                <span className="text-[10px] tracking-[0.25em] uppercase">
                    {playing ? 'Playing' : 'Sound'}
                </span>
            </motion.button>
        </>
    )
}
