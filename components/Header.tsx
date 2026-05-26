"use client"
import Link from 'next/link'
import useCart from '../store/useCart'

export default function Header(){
  const { items } = useCart()
  const count = items.reduce((s,i)=> s + i.quantity, 0)

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-serif">Made in Hvar</Link>
        <nav className="flex items-center gap-4">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/cart" className="ml-4">Cart ({count})</Link>
        </nav>
      </div>
    </header>
  )
}
