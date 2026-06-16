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

const SHIPPING_LABELS: Record<string, string> = {
  croatia: 'Croatia (local delivery)',
  eu: 'European Union',
  world: 'Worldwide (international)',
}

async function sendEmail(to: string[], subject: string, html: string) {
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@madeinhvar.com'
  if (!resendApiKey) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
    body: JSON.stringify({ from: `Made in Hvar <${fromEmail}>`, to, subject, html }),
  })
}

async function sendCustomerEmail(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
  if (!session.customer_email) return

  const customerName = escapeHtml(session.metadata?.customerName ?? 'there')
  const orderId = escapeHtml(session.id)
  const total = ((session.amount_total ?? 0) / 100).toFixed(2)

  const itemRows = lineItems
    .map((item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;">${item.quantity}×</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e8e0d8;">${escapeHtml(item.description ?? 'Product')}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;text-align:right;">€${((item.amount_subtotal ?? 0) / 100).toFixed(2)}</td>
      </tr>`)
    .join('')

  const html = `
    <html>
      <body style="margin:0;padding:0;background:#F7F3EF;font-family:Arial,sans-serif;color:#222;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EF;padding:40px 0;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;">

              <tr>
                <td style="background:#2C1810;padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#F7F3EF;font-family:Georgia,serif;font-size:26px;letter-spacing:1px;">Made in Hvar</h1>
                  <p style="margin:8px 0 0;color:#c9b99a;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Confirmed</p>
                </td>
              </tr>

              <tr>
                <td style="padding:40px 40px 24px;">
                  <p style="margin:0 0 16px;font-size:16px;">Hi ${customerName},</p>
                  <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444;">
                    Thank you for your order! We've received your payment and your handmade items from Hvar are being prepared for shipment.
                  </p>

                  <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Order reference</p>
                  <p style="margin:0 0 28px;font-family:monospace;font-size:13px;color:#555;background:#f5f0eb;padding:10px 14px;border-radius:4px;">${orderId}</p>

                  <h3 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Your order</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    ${itemRows}
                    <tr>
                      <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:15px;">Total paid</td>
                      <td style="padding:14px 0 0;font-weight:bold;font-size:15px;text-align:right;">€${total}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 40px 32px;">
                  <div style="background:#f5f0eb;border-radius:6px;padding:20px 24px;margin-top:24px;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:bold;">What happens next?</p>
                    <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">
                      Your package will be carefully packed and sent via post within 2–5 business days.
                      Once it's on its way, you'll receive a separate email with your tracking number.
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background:#f5f0eb;padding:20px 40px;border-top:1px solid #e8e0d8;">
                  <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
                    This is an automated confirmation — please do not reply to this email.
                    If you have any questions, contact us at
                    <a href="mailto:madeinhvar@gmail.com" style="color:#8B4513;">madeinhvar@gmail.com</a>.
                  </p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
    </html>
  `

  await sendEmail(
    [session.customer_email],
    `Your Made in Hvar order is confirmed — ${orderId}`,
    html
  )
}

async function sendOwnerEmail(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL
  if (!notifyEmail) return

  const orderId = escapeHtml(session.id)
  const customerName = escapeHtml(session.metadata?.customerName ?? 'N/A')
  const customerEmail = escapeHtml(session.customer_email ?? 'N/A')
  const customerPhone = escapeHtml(session.metadata?.customerPhone ?? 'N/A')
  const shippingKey = session.metadata?.shipping ?? ''
  const shippingLabel = escapeHtml(SHIPPING_LABELS[shippingKey] ?? shippingKey)
  const customerAddress = escapeHtml(session.metadata?.customerAddress ?? 'N/A')
  const notes = session.metadata?.notes?.trim() ?? ''
  const total = ((session.amount_total ?? 0) / 100).toFixed(2)

  const itemRows = lineItems
    .map((item) => `
      <tr>
        <td style="padding:10px 16px 10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;font-weight:bold;">${item.quantity}×</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;">${escapeHtml(item.description ?? 'Product')}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;text-align:right;">€${((item.amount_subtotal ?? 0) / 100).toFixed(2)}</td>
      </tr>`)
    .join('')

  const html = `
    <html>
      <body style="margin:0;padding:0;background:#F7F3EF;font-family:Arial,sans-serif;color:#222;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EF;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;">

              <tr>
                <td style="background:#8B4513;padding:28px 40px;">
                  <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:22px;">New order received</h1>
                  <p style="margin:6px 0 0;color:#f5d5b8;font-size:13px;">Action required — pack and post the items below</p>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Items to send</h2>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemRows}
                    <tr>
                      <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:16px;">Total paid by customer</td>
                      <td style="padding:14px 0 0;font-weight:bold;font-size:16px;text-align:right;color:#8B4513;">€${total}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Send to</h2>
                  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;">
                    <tr><td style="color:#888;width:120px;">Name</td><td style="font-weight:bold;">${customerName}</td></tr>
                    <tr><td style="color:#888;">Address</td><td>${customerAddress}</td></tr>
                    <tr><td style="color:#888;">Shipping via</td><td>${shippingLabel}</td></tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Customer contact</h2>
                  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;">
                    <tr><td style="color:#888;width:120px;">Email</td><td><a href="mailto:${customerEmail}" style="color:#8B4513;">${customerEmail}</a></td></tr>
                    <tr><td style="color:#888;">Phone</td><td>${customerPhone}</td></tr>
                  </table>
                </td>
              </tr>

              ${notes ? `
              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Customer note</h2>
                  <p style="margin:0;font-size:14px;color:#444;line-height:1.6;white-space:pre-wrap;">${escapeHtml(notes)}</p>
                </td>
              </tr>` : ''}

              <tr>
                <td style="padding:32px 40px;">
                  <div style="background:#fff8f0;border:1px solid #f5d5b8;border-radius:6px;padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#666;">
                      <strong>Order ID:</strong> <span style="font-family:monospace;">${orderId}</span><br/>
                      Once you've posted the package, reply to the customer at <a href="mailto:${customerEmail}" style="color:#8B4513;">${customerEmail}</a> with the tracking number.
                    </p>
                  </div>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
    </html>
  `

  await sendEmail(
    [notifyEmail],
    `NEW ORDER — Pack & post — ${customerName} — €${total}`,
    html
  )
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
      const lineItems = fullSession.line_items?.data ?? []
      await Promise.all([
        sendCustomerEmail(fullSession, lineItems),
        sendOwnerEmail(fullSession, lineItems),
      ])
    }
  }

  return NextResponse.json({ received: true })
}
