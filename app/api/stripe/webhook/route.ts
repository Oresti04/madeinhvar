import { NextResponse } from 'next/server'
import { getStripe } from '../../../../lib/stripe'
import Stripe from 'stripe'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function sendOrderEmail(session: Stripe.Checkout.Session) {
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@yourdomain.com'
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || ''

  if (!resendApiKey || !session.customer_email) return

  const lineItems = session.line_items?.data ?? []
  const formattedItems = lineItems
    .map((item) => `<li>${item.quantity}× ${escapeHtml(item.description ?? 'Product')} — €${((item.amount_subtotal ?? 0) / 100).toFixed(2)}</li>`)
    .join('')

  const customerName = escapeHtml(session.metadata?.customerName ?? 'Customer')
  const notes = session.metadata?.notes ?? ''

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background:#F7F3EF; color:#222; padding:24px;">
        <h1 style="font-family: 'Playfair Display', serif;">Order confirmation</h1>
        <p>Hi ${customerName},</p>
        <p>Your order <strong>${escapeHtml(session.id)}</strong> has been processed successfully.</p>
        <h3>Order details</h3>
        <ul>${formattedItems}</ul>
        <p><strong>Total:</strong> €${((session.amount_total ?? 0) / 100).toFixed(2)}</p>
        <h3>Shipping information</h3>
        <p><strong>Shipping:</strong> ${escapeHtml(session.metadata?.shipping ?? 'N/A')}</p>
        <p><strong>Address:</strong> ${escapeHtml(session.metadata?.customerAddress ?? 'Not provided')}</p>
        <p><strong>Contact:</strong> ${escapeHtml(session.customer_email)}${session.metadata?.customerPhone ? ` • ${escapeHtml(session.metadata.customerPhone)}` : ''}</p>
        ${notes ? `<p><strong>Order note:</strong> ${escapeHtml(notes)}</p>` : ''}
        <hr />
        <p style="font-size:0.95rem;color:#555;">Thank you for your order. We will be in touch shortly.</p>
      </body>
    </html>
  `

  const to = [session.customer_email]
  if (notifyEmail && notifyEmail !== session.customer_email) to.push(notifyEmail)

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject: `Made in Hvar — Order confirmation ${session.id}`,
      html,
    }),
  })
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook verification failed: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status === 'paid') {
      const stripe = getStripe()
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      })
      await sendOrderEmail(fullSession)
    }
  }

  return NextResponse.json({ received: true })
}
