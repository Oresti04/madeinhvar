import { NextResponse } from 'next/server'

// Replace these values in .env.local and Vercel:
// RESEND_API_KEY -> Resend API key
// RESEND_FROM_EMAIL -> verified sender email in Resend
// RESEND_NOTIFY_EMAIL -> email to receive owner notifications
export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing Resend API key' }, { status: 500 })
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@yourdomain.com'
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'owner@yourdomain.com'

  const body = await request.json()
  const { email, name, orderId, items, total, shipping, customerMessage } = body

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background:#F7F3EF; color:#222; padding:24px;">
        <h1>Order Confirmation</h1>
        <p>Thank you, ${name}.</p>
        <p>Your order <strong>${orderId}</strong> is confirmed.</p>
        <ul>
          ${items.map((item: any) => `<li>${item.quantity}× ${item.title} — €${(item.price/100).toFixed(2)}</li>`).join('')}
        </ul>
        <p>Total: €${(total/100).toFixed(2)}</p>
        <p>Shipping method: ${shipping}</p>
        <p>${customerMessage || ''}</p>
      </body>
    </html>
  `

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email, notifyEmail],
      subject: `Your Made in Hvar order ${orderId}`,
      html
    })
  })

  return NextResponse.json({ success: true })
}
