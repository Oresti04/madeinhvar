"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import useCart from '@/store/useCart'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, clear } = useCart()

  useEffect(() => { setMounted(true) }, [])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  if (!mounted) {
    return (
      <section>
        <h1 className="text-2xl font-serif mb-6">Cart</h1>
        <p className="text-muted">Loading...</p>
      </section>
    )
  }

  return (
    <section>
      <h1 className="text-2xl font-serif mb-6">Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted mb-4">Your cart is empty.</p>
          <Link href="/shop" className="btn btn-primary">Browse shop</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_300px] gap-8 items-start">

          {/* Items */}
          <div className="divide-y divide-black/8">
            {items.map((it) => (
              <div key={it.id} className="flex gap-5 py-6">
                <img
                  src={it.image}
                  alt={it.title}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-stone"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-snug">{it.title}</p>
                    <p className="font-medium flex-shrink-0">€{(it.price * it.quantity / 100).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted mt-1">€{(it.price / 100).toFixed(2)} each</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-black/15 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))}
                        className="px-3 py-1.5 text-sm hover:bg-black/5 transition-colors"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="px-3 py-1.5 text-sm border-x border-black/15 min-w-[2.5rem] text-center">{it.quantity}</span>
                      <button
                        onClick={() => updateQuantity(it.id, Math.min(10, it.quantity + 1))}
                        className="px-3 py-1.5 text-sm hover:bg-black/5 transition-colors"
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="text-sm text-muted hover:text-black transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <button onClick={() => clear()} className="text-sm text-muted hover:text-black transition-colors">
                Clear cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <aside className="card p-6 no-hover-card sticky top-24">
            <h2 className="font-serif text-lg mb-4">Order summary</h2>

            <div className="space-y-2.5 text-sm">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between text-muted">
                  <span className="truncate mr-2">{it.title} ×{it.quantity}</span>
                  <span className="flex-shrink-0">€{(it.price * it.quantity / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>€{(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-black/10 mt-4 pt-4 flex justify-between font-medium">
              <span>Estimated total</span>
              <span>€{(subtotal / 100).toFixed(2)}+</span>
            </div>

            <Link href="/checkout" className="btn btn-primary w-full text-center mt-5 block">
              Place order request
            </Link>

            <p className="mt-4 text-xs text-muted leading-relaxed">
              Payment is not collected here. After placing your request, we'll send a secure payment link to your email to complete the purchase.
            </p>
          </aside>

        </div>
      )}
    </section>
  )
}
