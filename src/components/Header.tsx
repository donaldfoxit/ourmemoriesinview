'use client'

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center px-8 md:px-14 py-5 md:py-7 z-50 backdrop-blur-xl bg-black/30 border-b border-white/[0.04]">
            <h2 className="text-sm md:text-base tracking-[0.35em] font-semibold uppercase select-none">
                Memories
            </h2>
            <nav className="flex items-center gap-6">
                <span className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white/80 cursor-pointer transition-colors duration-300 hidden md:inline">
                    Gallery
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white/80 cursor-pointer transition-colors duration-300">
                    About Us
                </span>
            </nav>
        </header>
    )
}
