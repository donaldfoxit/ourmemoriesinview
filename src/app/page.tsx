'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import PortraitGrid from '@/components/PortraitGrid'
import Loader from '@/components/Loader'
import MemoryModal from '@/components/MemoryModal'
import SurpriseMe from '@/components/SurpriseMe'
import AmbientPlayer from '@/components/AmbientPlayer'
import GoldenThread from '@/components/GoldenThread'
import FirstTouch from '@/components/FirstTouch'
import { type Memory } from '@/lib/memories'

export default function Home() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)

  return (
    <>
      <FirstTouch />
      <Loader />
      <main className="bg-black text-white">
        <Hero />
        <PortraitGrid onOpenMemory={setSelectedMemory} />
      </main>

      {/* Modal overlay */}
      <MemoryModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />

      {/* Floating UI */}
      <SurpriseMe onSurprise={setSelectedMemory} />
      <AmbientPlayer />
      <GoldenThread />
    </>
  )
}
