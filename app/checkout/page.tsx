"use client"
import { useState } from 'react'
import useCart from '../../store/useCart'

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [shipping, setShipping] = useState<'croatia'|'eu'|'world'>('croatia')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingCost = shipping === 'croatia' ? 500 : shipping === 'eu' ? 1200 : 2000
  const total = subtotal + shippingCost
  // Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local and Vercel to enable Stripe.
  const stripeEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

  async function handleStripeCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (items.length === 0) {
      setError('Please add at least one item to the cart.')
      return
    }
    setIsLoading(true)

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        shipping,
        email,
        name,
        address,
        total
      })
    })

    const data = await response.json()
    setIsLoading(false)

    if (!response.ok || !data.url) {
      setError(data.error || 'Unable to start Stripe checkout.')
      return
    }

    window.location.href = data.url
  }

  function handleFakePay(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const order = {
      id: `ORD-${Date.now()}`,
      name,
      email,
      address,
      shipping,
      items,
      total
    }
    localStorage.setItem('latestOrder', JSON.stringify(order))
    clear()
    window.location.href = '/checkout/success'
  }

  return (
    <section>
      <h1 className="text-2xl font-serif mb-6">Checkout</h1>
      <form onSubmit={stripeEnabled ? handleStripeCheckout : handleFakePay} className="grid gap-4 max-w-lg">
        <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="border px-3 py-2 rounded" required />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border px-3 py-2 rounded" required />
        <textarea placeholder="Shipping address" value={address} onChange={e=>setAddress(e.target.value)} className="border px-3 py-2 rounded" required />

        <div>
          <label className="font-medium">Shipping</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2"><input type="radio" name="ship" checked={shipping==='croatia'} onChange={()=>setShipping('croatia')} /> Croatia (€5)</label>
            <label className="flex items-center gap-2"><input type="radio" name="ship" checked={shipping==='eu'} onChange={()=>setShipping('eu')} /> EU (€12)</label>
            <label className="flex items-center gap-2"><input type="radio" name="ship" checked={shipping==='world'} onChange={()=>setShipping('world')} /> Worldwide (€20)</label>
          </div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="mt-4">
          <div className="text-muted">Total: €{(total/100).toFixed(2)}</div>
          <button type="submit" disabled={isLoading} className="mt-4 bg-terracotta px-4 py-2 rounded text-white disabled:opacity-50">
            {isLoading ? 'Processing…' : stripeEnabled ? 'Pay with Stripe' : 'Pay (Demo)'}
          </button>
        </div>

        {!stripeEnabled && (
          <p className="text-sm text-muted">Stripe is not configured. This form will use the local demo checkout flow.</p>
        )}
      </form>
    </section>
  )
}
