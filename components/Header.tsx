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
          <Link href="/cart" className="nav-link ml-4">
            Cart {hasMounted && count > 0 ? `(${count})` : ''}
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="text-sm font-medium">
            Cart {hasMounted && count > 0 ? `(${count})` : ''}
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
