'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ArcSlider from '@/components/ArcSlider';
import MemoryJournal from '@/components/MemoryJournal';

export default function Home() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeLayoutId, setActiveLayoutId] = useState('');

  const handleCardSelect = (project: any, layoutId: string) => {
    setActiveProject(project);
    setActiveLayoutId(layoutId);
  };

  const closeJournal = () => {
    setActiveProject(null);
    setActiveLayoutId('');
  };

  return (
    <main className="bg-[#f0eeec] min-h-screen text-[#0a0a0a] overflow-hidden selection:bg-black selection:text-white">
      {/* Background Arc Slider */}
      <ArcSlider onCardSelect={handleCardSelect} />

      {/* Foreground Interactive Journal */}
      <AnimatePresence>
        {activeProject && (
          <MemoryJournal
            key="journal"
            project={activeProject}
            layoutId={activeLayoutId}
            onClose={closeJournal}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
