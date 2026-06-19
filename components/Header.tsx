"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useCart from '../store/useCart'

export default function Header() {
  const { items } = useCart()
  const [hasMounted, setHasMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const count = hasMounted ? items.reduce((s, i) => s + i.quantity, 0) : 0

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-serif tracking-tight text-black">Made in Hvar</Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/shop" className="nav-link">Shop</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          <Link href="/cart" className="nav-link ml-4 relative" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {hasMounted && count > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracotta text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">{count}</span>
            )}
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {hasMounted && count > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracotta text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">{count}</span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="p-1 flex flex-col gap-1.5"
          >
            <span className={`block h-0.5 w-6 bg-black origin-center transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-black transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-black origin-center transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-200 ${menuOpen ? 'max-h-48 border-t border-black/10' : 'max-h-0'}`}>
        <nav className="container flex flex-col py-4 gap-4 text-sm bg-white/95">
          <Link href="/shop" className="nav-link w-fit">Shop</Link>
          <Link href="/about" className="nav-link w-fit">About</Link>
          <Link href="/contact" className="nav-link w-fit">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
