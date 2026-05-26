"use client"
import useCart from '../../store/useCart'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clear } = useCart()

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

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
                    <input type="number" min={1} value={it.quantity} onChange={(e)=> updateQuantity(it.id, Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
                    <button onClick={()=> removeItem(it.id)} className="ml-4 text-sm text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => clear()} className="mt-4 text-sm text-muted">Clear cart</button>
          </div>

          <aside className="rounded p-6 shadow-sm bg-white">
            <h2 className="font-serif">Order Summary</h2>
            <div className="mt-4 text-muted">Subtotal: €{(subtotal/100).toFixed(2)}</div>
            <div className="mt-2 text-muted">Shipping: fixed at checkout</div>
            <div className="mt-4">
              <a href="/checkout" className="inline-block bg-muted text-white px-4 py-2 rounded">Proceed to checkout</a>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}
