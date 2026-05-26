"use client"

import { useEffect, useState } from 'react'

export default function SuccessPage(){
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('latestOrder')
    if (stored) setOrder(JSON.parse(stored))
  }, [])

  return (
    <section>
      <h1 className="text-2xl font-serif mb-4">Order placed (Demo)</h1>
      <p className="text-muted">This is a demo checkout. In production you'll be redirected from Stripe Checkout.</p>
      {order ? (
        <div className="mt-4 bg-white rounded p-4 shadow-sm">
          <div>Order ID: {order.id}</div>
          <div>Name: {order.name}</div>
          <div>Email: {order.email}</div>
          <div>Shipping: {order.shipping}</div>
          <div>Total: €{(order.total/100).toFixed(2)}</div>
        </div>
      ) : (
        <p className="mt-4 text-muted">No recent demo order found.</p>
      )}
    </section>
  )
}
