import { NextResponse } from 'next/server'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Fallback email sender — the webhook route handles emails automatically.
// This route is kept for manual retries or debugging only.
export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing Resend API key' }, { status: 500 })
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@yourdomain.com'
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'owner@yourdomain.com'

  const body = await request.json()
  const {
    email,
    name,
    orderId,
    items,
    total,
    shipping,
    customerAddress,
    phone,
    notes,
    paymentStatus
  } = body as {
    email?: string; name?: string; orderId?: string
    items?: Array<{ name: string; quantity: number; amountSubtotal: number }>
    total?: number; shipping?: string; customerAddress?: string
    phone?: string; notes?: string; paymentStatus?: string
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
  }
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
  }

  const itemRows = Array.isArray(items) ? items : []
  const formattedItems = itemRows
    .map((item) => `<li>${item.quantity}× ${escapeHtml(item.name)} — €${(item.amountSubtotal / 100).toFixed(2)}</li>`)
    .join('')

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background:#F7F3EF; color:#222; padding:24px;">
        <h1 style="font-family: 'Playfair Display', serif;">Order confirmation</h1>
        <p>Hi ${escapeHtml(name || 'Customer')},</p>
        <p>Your order <strong>${escapeHtml(orderId)}</strong> has been processed successfully.</p>
        <h3>Order details</h3>
        <ul>${formattedItems}</ul>
        <p><strong>Total:</strong> €${(typeof total === 'number' ? total / 100 : 0).toFixed(2)}</p>
        <p><strong>Payment status:</strong> ${escapeHtml(paymentStatus || 'Unknown')}</p>
        <h3>Shipping information</h3>
        <p><strong>Shipping:</strong> ${escapeHtml(shipping || 'N/A')}</p>
        <p><strong>Address:</strong> ${escapeHtml(customerAddress || 'Not provided')}</p>
        <p><strong>Contact:</strong> ${escapeHtml(email)}${phone ? ` • ${escapeHtml(phone)}` : ''}</p>
        ${notes ? `<p><strong>Order note:</strong> ${escapeHtml(notes)}</p>` : ''}
        <hr />
        <p style="font-size:0.95rem;color:#555;">This email was sent automatically.</p>
      </body>
    </html>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: fromEmail,
      to: [email, notifyEmail],
      subject: `Made in Hvar order confirmation — ${orderId}`,
      html,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unable to parse response')
    return NextResponse.json(
      { error: `Resend API error: ${response.status} ${response.statusText} - ${errorBody}` },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
