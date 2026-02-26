'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';

interface JournalProps {
    project: any;
    layoutId: string;
    onClose: () => void;
}

export default function MemoryJournal({ project, layoutId, onClose }: JournalProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Stop audio on unmount or close
    useEffect(() => {
        return () => {
            if (audioRef.current && isPlaying) {
                audioRef.current.pause();
            }
        };
    }, [isPlaying]);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
            setIsPlaying(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#fffdfc] flex flex-col md:flex-row overflow-hidden"
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 z-[60] w-12 h-12 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 hover:bg-white/80 transition-all"
            >
                <X size={24} />
            </button>

            {/* Left Panel: The expanded Hero Image (Framer Motion FLIP target) */}
            <div className="flex-[1.2] h-[50vh] md:h-full relative md:p-8 flex items-center justify-center">
                <motion.img
                    layoutId={layoutId} // MAGIC: This connects to the ArcSlider image!
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover md:rounded-xl shadow-2xl"
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                />
            </div>

            {/* Right Panel: Editorial Text & Audio Player */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="flex-[0.8] p-8 md:p-24 flex flex-col justify-center bg-[#fffdfc]"
            >
                <div className="font-mono text-xs text-[#aeaeae] uppercase tracking-widest mb-8 flex items-center gap-4">
                    <span>{project.date}</span>
                    <span>•</span>
                    <span>{project.coordinates}</span>
                </div>

                <h2 className="font-serif text-4xl md:text-6xl font-medium leading-[1.1] mb-8 text-[#0a0a0a]">
                    {project.title.replace('.', '')}
                </h2>

                <p className="text-lg leading-relaxed text-[#444] max-w-[85%] mb-12">
                    {project.story}
                </p>

                {/* Audio Player UI */}
                {project.audioSrc && (
                    <div className="flex items-center gap-6 p-6 bg-[#f8f8f8] rounded-full w-max border border-black/5 hover:bg-[#f0f0f0] hover:-translate-y-1 transition-all group">
                        <button
                            onClick={toggleAudio}
                            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center active:scale-90 transition-transform"
                        >
                            {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-1" />}
                        </button>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-[#aeaeae]">Listen to this memory</span>
                            <div className="flex items-center gap-1 h-3">
                                {/* Fake Waveform */}
                                {[4, 10, 6, 12, 8, 5].map((height, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-[3px] bg-[#ccc] rounded-full"
                                        animate={{
                                            height: isPlaying ? [4, 16, 4] : height,
                                            backgroundColor: isPlaying ? '#0a0a0a' : '#ccc'
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: isPlaying ? Infinity : 0,
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <audio
                            ref={audioRef}
                            src={project.audioSrc}
                            onEnded={() => setIsPlaying(false)}
                            className="hidden"
                        />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
