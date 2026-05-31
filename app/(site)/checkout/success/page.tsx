"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import useCart from '@/store/useCart'

type StripeSession = {
  id: string
  paymentStatus: string
  amountTotal: number
  currency: string
  customerEmail?: string | null
  customerName?: string | null
  customerAddress?: string | null
  notes?: string | null
  shipping?: string | null
  lineItems: Array<{ name: string; quantity: number; amountSubtotal: number }>
}

function SuccessContent() {
  const [session, setSession] = useState<StripeSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const { clear } = useCart()

  useEffect(() => {
    const sessionId = searchParams?.get('session_id')
    if (!sessionId) {
      setError('No session found. Please return to your cart and try again.')
      return
    }

    const fetchSession = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      const data = await response.json()
      setIsLoading(false)

      if (!response.ok) {
        setError(data.error || 'Could not verify your order.')
        return
      }

      setSession(data)
      if (data.paymentStatus === 'paid') clear()
    }

    fetchSession()
  }, [searchParams])

  if (isLoading) return <p className="text-muted">Verifying your order…</p>
  if (error) return <div className="text-red-600">{error}</div>
  if (!session) return null

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="font-semibold mb-2">Payment: {session.paymentStatus}</div>
        <div className="text-muted text-sm">Order ID: {session.id}</div>
        {session.customerName && <div className="mt-1">Name: {session.customerName}</div>}
        <div className="mt-1">Email: {session.customerEmail}</div>
        {session.shipping && <div className="mt-1">Shipping: {session.shipping}</div>}
        {session.customerAddress && <div className="mt-1">Address: {session.customerAddress}</div>}
        <div className="mt-3 font-semibold">
          Total: €{(session.amountTotal / 100).toFixed(2)} {session.currency?.toUpperCase()}
        </div>
      </div>

      <div className="card p-6">
        <div className="font-medium mb-3">Items ordered</div>
        <ul className="list-disc ml-5 space-y-1 text-muted">
          {session.lineItems.map((item) => (
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
