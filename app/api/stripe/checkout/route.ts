import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Replace these values with your Stripe secret key in .env.local and Vercel settings.
// STRIPE_SECRET_KEY -> Stripe secret API key
// NEXT_PUBLIC_SITE_URL -> production site URL used for success/cancel redirects
export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Missing Stripe secret key' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
  })

  const body = await request.json()
  const { items, shipping, email } = body
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 })
  }

  const line_items = items.map((item: any) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.title,
        description: item.description || 'Handmade product'
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    success_url: `${baseUrl}/checkout/success`,
    cancel_url: `${baseUrl}/cart`,
    customer_email: email,
    metadata: {
      shipping,
      orderType: 'made-in-hvar-demo'
    }
  })

  return NextResponse.json({ url: session.url })
}
