"use client"
import { useEffect, useMemo, useState } from 'react'
import useCart from '@/store/useCart'

const SHIPPING_OPTIONS = [
  { id: 'croatia', label: 'Croatia', subtitle: 'Fast local delivery', cost: 500 },
  { id: 'eu', label: 'EU', subtitle: 'Standard European delivery', cost: 1200 },
  { id: 'world', label: 'Worldwide', subtitle: 'International shipping', cost: 2000 }
] as const

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [shipping, setShipping] = useState<'croatia'|'eu'|'world'>('croatia')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('Croatia')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <section className="checkout-page">
        <h1 className="text-2xl font-serif mb-6">Checkout</h1>
        <p className="text-muted">Loading checkout details…</p>
      </section>
    )
  }

  const shippingOption = SHIPPING_OPTIONS.find((option) => option.id === shipping)!
  const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0)
  const total = subtotal + shippingOption.cost
  const fullAddress = `${address}, ${city}, ${postalCode}, ${country}`

  const itemSummary = useMemo(() => (
    items.map((item) => ({
      ...item,
      totalPrice: item.price * item.quantity
    }))
  ), [items])

  async function handleStripeCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError('Your cart is empty. Please add at least one item before checkout.')
      return
    }

    if (!name || !email || !phone || !address || !city || !postalCode || !country) {
      setError('Please complete all customer and shipping fields.')
      return
    }

    setIsLoading(true)

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        shipping,
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        notes,
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

  return (
    <section className="checkout-page">
      <h1 className="text-2xl font-serif mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={handleStripeCheckout} className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-serif mb-4">Customer details</h2>
            <div className="grid gap-4">
              <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="field" required />
              <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="field" required />
              <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="field" required />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-serif mb-4">Shipping address</h2>
            <div className="grid gap-4">
              <input placeholder="Street address" value={address} onChange={e => setAddress(e.target.value)} className="field" required />
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="field" required />
                <input placeholder="Postal code" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="field" required />
              </div>
              <input placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} className="field" required />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-serif mb-4">Order notes</h2>
            <textarea placeholder="Add delivery details or special instructions" value={notes} onChange={e => setNotes(e.target.value)} className="field min-h-[120px] resize-none" />
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-serif mb-4">Shipping method</h2>
            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((option) => (
                <label key={option.id} className="block rounded-lg border p-4 transition hover:border-terracotta">
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shipping === option.id}
                    onChange={() => setShipping(option.id)}
                    className="mr-3"
                  />
                  <span className="font-medium">{option.label}</span>
                  <div className="text-sm text-muted">{option.subtitle}</div>
                  <div className="mt-2 text-sm">€{(option.cost/100).toFixed(2)}</div>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="card p-6">
            <h2 className="text-xl font-serif mb-4">Payment details</h2>
            <p className="text-muted">You will complete payment securely through Stripe Checkout. We do not store your card details on this site.</p>
            <div className="mt-5 grid gap-3">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>{isMounted ? `€${(subtotal / 100).toFixed(2)}` : '—'}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>{shippingOption.label} shipping</span>
                <span>€{(shippingOption.cost / 100).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{isMounted ? `€${(total / 100).toFixed(2)}` : '—'}</span>
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary disabled:opacity-50">
                {isLoading ? 'Processing…' : 'Pay with Stripe'}
              </button>
            </div>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="card p-6 no-hover-card">
            <h2 className="text-xl font-serif mb-4">Order summary</h2>
            {items.length === 0 ? (
              <p className="text-muted">No items in the cart yet.</p>
            ) : (
              <div className="space-y-4">
                {itemSummary.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted">{item.quantity} × €{(item.price / 100).toFixed(2)}</div>
                      <div className="text-sm">€{(item.totalPrice / 100).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-serif mb-4">Shipping & delivery</h2>
            <div className="text-sm text-muted">
              Your package will be prepared and shipped within 2-5 business days once the payment is complete.
            </div>
            <div className="mt-4 text-sm">
              <div className="font-medium">Delivery address</div>
              <div className="text-muted">{isMounted ? fullAddress : 'Address will appear here'}</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
