import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PortraitGrid from '@/components/PortraitGrid'
import Loader from '@/components/Loader'

export default function Home() {
  return (
    <>
      <Loader />
      <Header />
      <main className="bg-black text-white">
        <Hero />
        <PortraitGrid />
      </main>
    </>
  )
}
