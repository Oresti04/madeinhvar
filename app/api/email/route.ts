import { NextResponse } from 'next/server'

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

async function sendEmail(to: string[], subject: string, html: string, fromEmail: string, apiKey: string) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: `Made in Hvar <${fromEmail}>`, to, subject, html }),
  })
}

// Fallback email sender — the webhook route handles emails automatically.
// This route is kept for manual retries or debugging only.
export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing Resend API key' }, { status: 500 })
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@madeinhvar.com'
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || ''
  const apiKey = process.env.RESEND_API_KEY

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
  const totalFormatted = (typeof total === 'number' ? total / 100 : 0).toFixed(2)
  const shippingLabel = SHIPPING_LABELS[shipping ?? ''] ?? (shipping ?? 'N/A')

  const customerItemRows = itemRows
    .map((item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;">${item.quantity}×</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e8e0d8;">${escapeHtml(item.name)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;text-align:right;">€${(item.amountSubtotal / 100).toFixed(2)}</td>
      </tr>`)
    .join('')

  const customerHtml = `
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
                  <p style="margin:0 0 16px;font-size:16px;">Hi ${escapeHtml(name || 'there')},</p>
                  <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444;">
                    Thank you for your order! We've received your payment and your handmade items from Hvar are being prepared for shipment.
                  </p>
                  <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Order reference</p>
                  <p style="margin:0 0 28px;font-family:monospace;font-size:13px;color:#555;background:#f5f0eb;padding:10px 14px;border-radius:4px;">${escapeHtml(orderId)}</p>
                  <h3 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Your order</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    ${customerItemRows}
                    <tr>
                      <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:15px;">Total paid</td>
                      <td style="padding:14px 0 0;font-weight:bold;font-size:15px;text-align:right;">€${totalFormatted}</td>
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

  const ownerItemRows = itemRows
    .map((item) => `
      <tr>
        <td style="padding:10px 16px 10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;font-weight:bold;">${item.quantity}×</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;">${escapeHtml(item.name)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;text-align:right;">€${(item.amountSubtotal / 100).toFixed(2)}</td>
      </tr>`)
    .join('')

  const ownerHtml = `
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
                    ${ownerItemRows}
                    <tr>
                      <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:16px;">Total paid by customer</td>
                      <td style="padding:14px 0 0;font-weight:bold;font-size:16px;text-align:right;color:#8B4513;">€${totalFormatted}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Send to</h2>
                  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;">
                    <tr><td style="color:#888;width:120px;">Name</td><td style="font-weight:bold;">${escapeHtml(name || 'N/A')}</td></tr>
                    <tr><td style="color:#888;">Address</td><td>${escapeHtml(customerAddress || 'N/A')}</td></tr>
                    <tr><td style="color:#888;">Shipping via</td><td>${escapeHtml(shippingLabel)}</td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Customer contact</h2>
                  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;">
                    <tr><td style="color:#888;width:120px;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#8B4513;">${escapeHtml(email)}</a></td></tr>
                    ${phone ? `<tr><td style="color:#888;">Phone</td><td>${escapeHtml(phone)}</td></tr>` : ''}
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
                      <strong>Order ID:</strong> <span style="font-family:monospace;">${escapeHtml(orderId)}</span><br/>
                      <strong>Payment:</strong> ${escapeHtml(paymentStatus || 'paid')}<br/>
                      Once you've posted the package, reply to the customer at <a href="mailto:${escapeHtml(email)}" style="color:#8B4513;">${escapeHtml(email)}</a> with the tracking number.
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

  const [customerRes, ownerRes] = await Promise.all([
    sendEmail([email], `Your Made in Hvar order is confirmed — ${orderId}`, customerHtml, fromEmail, apiKey),
    notifyEmail ? sendEmail([notifyEmail], `NEW ORDER — Pack & post — ${name || email} — €${totalFormatted}`, ownerHtml, fromEmail, apiKey) : Promise.resolve(null),
  ])

  if (!customerRes.ok) {
    const errorBody = await customerRes.text().catch(() => 'Unable to parse response')
    return NextResponse.json(
      { error: `Resend API error (customer email): ${customerRes.status} ${customerRes.statusText} - ${errorBody}` },
      { status: 502 }
    )
  }
  if (ownerRes && !ownerRes.ok) {
    const errorBody = await ownerRes.text().catch(() => 'Unable to parse response')
    return NextResponse.json(
      { error: `Resend API error (owner email): ${ownerRes.status} ${ownerRes.statusText} - ${errorBody}` },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
