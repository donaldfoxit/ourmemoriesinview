import type { Metadata } from 'next'
import { Inter, Caveat, Dancing_Script, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Our Memories In View',
  description: 'A living gallery of the moments that made us, us.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${dancing.variable} ${playfair.variable}`}>
      <body className="font-sans relative">
        <div className="grain" />

        {/* Global Cinematic Viewfinder Frame */}
        <div className="fixed inset-4 md:inset-6 z-[9999] pointer-events-none border border-white/[0.08] rounded-2xl mix-blend-overlay" />
        {/* Inner thin glow to the frame */}
        <div className="fixed inset-4 md:inset-6 z-[9999] pointer-events-none border border-[var(--accent)] opacity-[0.03] rounded-2xl" />

        {children}
      </body>
    </html>
  )
}
