'use client'

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center px-8 md:px-14 py-5 md:py-7 z-50 backdrop-blur-xl bg-black/30 border-b border-white/[0.04]">
            <h2 className="text-sm md:text-base tracking-[0.35em] font-semibold uppercase select-none">
                LEGEND
            </h2>
            <button className="relative bg-white/95 text-black px-5 md:px-7 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide uppercase overflow-hidden group transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]">
                <span className="relative z-10">Login</span>
                {/* Hover sweep effect */}
                <span className="absolute inset-0 bg-[var(--accent)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </button>
        </header>
    )
}
