"use client"
import { useEffect, useState } from 'react'
import useCart from '@/store/useCart'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, clear } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  if (!mounted) {
    return (
      <section>
        <h1 className="text-2xl font-serif mb-6">Cart</h1>
        <p className="text-muted">Loading cart...</p>
      </section>
    )
  }

  return (
    <section>
      <h1 className="text-2xl font-serif mb-6">Cart</h1>
      {items.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 py-4 border-b">
                <img src={it.image} alt={it.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-muted">€{(it.price/100).toFixed(2)}</div>
                  <div className="mt-2">
                    <label className="mr-2">Qty</label>
                    <input type="number" min={1} value={it.quantity} onChange={(e)=> updateQuantity(it.id, Number(e.target.value))} className="field w-20" />
                    <button onClick={()=> removeItem(it.id)} className="ml-4 text-sm text-black/80 hover:text-black">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => clear()} className="mt-4 text-sm text-muted">Clear cart</button>
          </div>

          <aside className="card p-6 bg-white no-hover-card">
            <h2 className="font-serif">Order Summary</h2>
            <div className="mt-4 text-muted">Subtotal: €{(subtotal/100).toFixed(2)}</div>
            <div className="mt-2 text-muted">Shipping: fixed at checkout</div>
            <div className="mt-4">
              <a href="/checkout" className="inline-block btn btn-primary">Proceed to checkout</a>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}
