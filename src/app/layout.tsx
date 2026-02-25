import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Legend Creative — Elite Mentorship',
  description: 'Elite mentorship in animation, VFX, and compositing. Build your creative legend.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {/* Film grain overlay — always on top */}
        <div className="grain" />
        {children}
      </body>
    </html>
  )
}
