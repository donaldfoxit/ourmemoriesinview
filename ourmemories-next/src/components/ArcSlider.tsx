'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';

// The configuration math from vanilla script.js
function getCardWidth(vw: number) {
    if (vw <= 480) return vw * 0.35;
    if (vw <= 768) return vw * 0.25;
    return Math.min(vw * 0.18, 300);
}

function getArcConfig(vw: number, vh: number) {
    const cardW = getCardWidth(vw);
    const arcRadius = vh * 0.25;
    const baseY = vh * 0.46;

    return {
        centerX: (vw * 0.84) / 2, // center of the 84%-wide container
        baseY,
        arcRadius,
        cardWidth: cardW,
        totalVisible: 14,
    };
}

export default function ArcSlider({ onCardSelect }: { onCardSelect: (project: any, id: string) => void }) {
    const TOTAL = projects.length;
    const scrollPosRef = useRef(0);
    const targetScrollRef = useRef(0);
    const [dimensions, setDimensions] = useState({ vw: 0, vh: 0 });
    const [layouts, setLayouts] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Track center index to update title
    const [centerIndex, setCenterIndex] = useState(0);

    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartScrollRef = useRef(0);

    // Initialize dimensions
    useEffect(() => {
        setIsMounted(true);
        const updateDims = () => setDimensions({ vw: window.innerWidth, vh: window.innerHeight });
        window.addEventListener('resize', updateDims);
        updateDims();
        return () => window.removeEventListener('resize', updateDims);
    }, []);

    // Animation Loop
    useEffect(() => {
        if (dimensions.vw === 0) return;
        let animationFrameId: number;

        const animate = () => {
            // Smooth interpolation
            scrollPosRef.current += (targetScrollRef.current - scrollPosRef.current) * 0.08;

            const cfg = getArcConfig(dimensions.vw, dimensions.vh);
            const halfVisible = cfg.totalVisible / 2;
            const bottomLine = dimensions.vh * 0.50;
            const maxCardH = dimensions.vh * 0.34;
            const minCardH = dimensions.vh * 0.12;
            const containerW = dimensions.vw * 0.84;

            const newLayouts = [];

            for (let i = 0; i < TOTAL; i++) {
                let diff = i - scrollPosRef.current;
                while (diff > TOTAL / 2) diff -= TOTAL;
                while (diff < -TOTAL / 2) diff += TOTAL;

                const absDiff = Math.abs(diff);

                if (absDiff > halfVisible + 1) {
                    newLayouts.push(null); // Too far to render
                    continue;
                }

                const cardW = cfg.cardWidth;
                const heightT = Math.min(absDiff / (halfVisible * 0.7), 1);
                const cardH = maxCardH - (maxCardH - minCardH) * Math.pow(heightT, 1.5);
                const spreadX = cardW * 0.85;
                const x = cfg.centerX + diff * spreadX;

                const normalizedDist = diff / halfVisible;
                const arcDrop = cfg.arcRadius * normalizedDist * normalizedDist;
                const y = bottomLine + arcDrop;

                const zIndex = Math.round(100 - absDiff * 10);

                const leftEdge = x - cardW / 2;
                const rightEdge = x + cardW / 2;
                let opacity = 1;
                if (leftEdge < 0 || rightEdge > containerW) opacity = 0;

                const isCenter = absDiff < 0.5;
                const scale = isCenter ? 1.05 : 1;

                newLayouts.push({
                    x: x - cardW / 2,
                    y: y - cardH,
                    w: cardW,
                    h: cardH,
                    zIndex,
                    opacity,
                    scale,
                    isCenter,
                    clickable: absDiff < 3
                });
            }

            setLayouts(newLayouts);

            // Update center index
            const wrapped = ((scrollPosRef.current % TOTAL) + TOTAL) % TOTAL;
            setCenterIndex(Math.round(wrapped) % TOTAL);

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, TOTAL]);

    // Event Handlers
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const d = e.deltaY || e.deltaX;
            targetScrollRef.current += d * 0.003;
        };

        const onPointerDown = (e: PointerEvent | MouseEvent) => {
            isDraggingRef.current = true;
            dragStartXRef.current = (e as MouseEvent).clientX ?? 0;
            dragStartScrollRef.current = targetScrollRef.current;
        };

        const onPointerMove = (e: PointerEvent | MouseEvent) => {
            if (!isDraggingRef.current) return;
            const cx = (e as MouseEvent).clientX ?? 0;
            const dx = cx - dragStartXRef.current;
            const cfg = getArcConfig(dimensions.vw, dimensions.vh);
            targetScrollRef.current = dragStartScrollRef.current - dx / (cfg.cardWidth * 0.92);
        };

        const onPointerUp = () => { isDraggingRef.current = false; };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') targetScrollRef.current += 1;
            if (e.key === 'ArrowLeft') targetScrollRef.current -= 1;
        };

        // Attach global events
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        window.addEventListener('keydown', onKeyDown);

        // Attach wheel to slider container specifically via ref to prevent default safely
        const sliderEl = document.getElementById('arc-slider-container');
        if (sliderEl) {
            sliderEl.addEventListener('wheel', onWheel as any, { passive: false });
            sliderEl.addEventListener('mousedown', onPointerDown as any);
        }

        return () => {
            window.removeEventListener('mousemove', onPointerMove);
            window.removeEventListener('mouseup', onPointerUp);
            window.removeEventListener('keydown', onKeyDown);
            if (sliderEl) {
                sliderEl.removeEventListener('wheel', onWheel as any);
                sliderEl.removeEventListener('mousedown', onPointerDown as any);
            }
        };
    }, [dimensions]);

    const handleCardClick = (index: number, project: any, layout: any) => {
        if (layout.isCenter) {
            // It's the center card, trigger deep dive
            onCardSelect(project, `card-${project.slug}`);
        } else {
            // Not center card, scroll to it
            let diff = index - scrollPosRef.current;
            while (diff > TOTAL / 2) diff -= TOTAL;
            while (diff < -TOTAL / 2) diff += TOTAL;
            targetScrollRef.current = scrollPosRef.current + diff;
        }
    };

    if (!isMounted) return null; // Prevent hydration mismatch

    return (
        <>
            {/* Header / Project Title Area */}
            <header className="fixed top-0 left-0 w-full h-[100vh] flex items-start justify-center pt-[56vh] z-10 pointer-events-none mix-blend-difference">
                <nav className="flex items-center text-white text-[1.11vw] tracking-wider whitespace-nowrap">
                    <span className="px-5 cursor-pointer pointer-events-auto hover:font-bold transition-all">Our Memories In View</span>
                    <span className="px-5 pointer-events-auto font-bold underline transition-all">
                        {projects[centerIndex]?.title || '—'}
                    </span>
                    <span className="px-5 cursor-pointer pointer-events-auto hover:font-bold transition-all">The Beginning</span>
                    <span className="px-5 cursor-pointer pointer-events-auto hover:font-bold transition-all">Adventures</span>
                    <span className="px-5 cursor-pointer pointer-events-auto hover:font-bold transition-all">Quiet Moments</span>
                </nav>
            </header>

            {/* Slider Engine */}
            <div id="arc-slider-container" className="fixed inset-0 z-[1] cursor-grab active:cursor-grabbing overflow-hidden">
                <div className="absolute left-[8%] top-0 w-[84%] h-full pointer-events-none">
                    {layouts.map((layout, i) => {
                        if (!layout) return null;
                        const proj = projects[i];
                        const layoutId = `card-${proj.slug}`;

                        return (
                            <motion.div
                                key={proj.slug}
                                layoutId={layoutId} // MAGIC: Framer Motion hooks onto this String
                                onClick={() => handleCardClick(i, proj, layout)}
                                className="absolute top-0 left-0 bg-[#1a1a1a] overflow-hidden rounded-md pointer-events-auto origin-center"
                                animate={{
                                    width: layout.w,
                                    height: layout.h,
                                    zIndex: layout.zIndex,
                                    x: layout.x,
                                    y: layout.y,
                                    scale: layout.scale,
                                    opacity: layout.opacity,
                                    boxShadow: layout.isCenter ? '0 12px 60px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.15)',
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 40,
                                    mass: 0.8
                                }}
                                style={{
                                    willChange: 'transform, opacity',
                                    pointerEvents: layout.clickable ? 'auto' : 'none'
                                }}
                            >
                                <img src={proj.img} alt={proj.title} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
