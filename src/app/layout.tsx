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
        <div className="fixed inset-4 md:inset-8 z-[9999] pointer-events-none border border-[var(--fg)]/[0.08] mix-blend-overlay" />

        {/* Viewfinder Reticles (Tiny Crosshairs) */}
        <div className="fixed top-1/2 left-4 md:left-8 w-2 h-[1px] bg-[var(--fg)]/30 z-[9999] pointer-events-none -translate-x-1/2" />
        <div className="fixed top-1/2 right-4 md:right-8 w-2 h-[1px] bg-[var(--fg)]/30 z-[9999] pointer-events-none translate-x-1/2" />
        <div className="fixed top-4 md:top-8 left-1/2 w-[1px] h-2 bg-[var(--fg)]/30 z-[9999] pointer-events-none -translate-y-1/2" />
        <div className="fixed bottom-4 md:bottom-8 left-1/2 w-[1px] h-2 bg-[var(--fg)]/30 z-[9999] pointer-events-none translate-y-1/2" />

        {children}
      </body>
    </html>
  )
}
