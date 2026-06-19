"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import useCart from '@/store/useCart'

type OrderSummary = {
  orderId: string
  name: string
  email: string
  phone: string
  address: string
  shipping: string
  notes: string
  total: number
  items: Array<{ name: string; quantity: number; amountSubtotal: number }>
}

const SHIPPING_LABELS: Record<string, string> = {
  croatia: 'Croatia',
  eu: 'European Union',
  world: 'Worldwide',
}

function SuccessContent() {
  const [order, setOrder] = useState<OrderSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { clear } = useCart()

  useEffect(() => {
    const encoded = searchParams?.get('order')
    if (!encoded) {
      setError('No order information found. Please check your email for confirmation.')
      return
    }

    try {
      const decoded = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')))
      setOrder(decoded)
      clear()
    } catch {
      setError('Could not load order details. Please check your email for confirmation.')
    }
  }, [searchParams])

  if (error) return <div className="text-red-600">{error}</div>
  if (!order) return null

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="font-semibold text-green-700 mb-2">Payment successful</div>
        <div className="text-muted text-sm mb-3">Order reference: {order.orderId}</div>
        <div className="space-y-1 text-sm">
          {order.name && <div><span className="text-muted">Name:</span> {order.name}</div>}
          <div><span className="text-muted">Email:</span> {order.email}</div>
          {order.phone && <div><span className="text-muted">Phone:</span> {order.phone}</div>}
          {order.shipping && <div><span className="text-muted">Shipping:</span> {SHIPPING_LABELS[order.shipping] ?? order.shipping}</div>}
          {order.address && <div><span className="text-muted">Address:</span> {order.address}</div>}
          {order.notes && <div><span className="text-muted">Note:</span> {order.notes}</div>}
        </div>
        <div className="mt-4 pt-4 border-t font-semibold">
          Total: €{(order.total / 100).toFixed(2)}
        </div>
      </div>

      <div className="card p-6">
        <div className="font-medium mb-3">Items ordered</div>
        <ul className="list-disc ml-5 space-y-1 text-muted text-sm">
          {order.items.map((item) => (
            <li key={`${item.name}-${item.quantity}`}>
              {item.name} × {item.quantity} — €{(item.amountSubtotal / 100).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <Link href="/shop" className="inline-block btn btn-primary mt-2">Continue shopping</Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <section>
      <h1 className="text-2xl font-serif mb-2">Order confirmed</h1>
      <p className="text-muted mb-6">Thank you for your purchase. A confirmation email will be sent to you shortly.</p>
      <Suspense fallback={<p className="text-muted">Loading order details…</p>}>
        <SuccessContent />
      </Suspense>
    </section>
  )
}
