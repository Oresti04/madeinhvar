import { NextResponse } from 'next/server'
import { getProductBySlug } from '../../../lib/products'

const SHIPPING_RATES: Record<string, number> = {
  croatia: 500,
  eu: 1200,
  world: 2000,
}

const SHIPPING_LABELS: Record<string, string> = {
  croatia: 'Croatia (local delivery)',
  eu: 'European Union',
  world: 'Worldwide (international)',
}

// In-memory rate limit: max 2 order requests per IP per hour
const rateLimitStore = new Map<string, { count: number; windowStart: number }>()
const RATE_LIMIT_MAX = 2
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) return true

  entry.count++
  return false
}

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function parseItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) throw new Error('No items provided')
  if (value.length > 10) throw new Error('Too many different items in one order (max 10)')

  return Promise.all(
    value.map(async (item, index) => {
      if (!item || typeof item !== 'object') throw new Error(`Invalid item at index ${index}`)

      const id = typeof (item as any).id === 'string' ? (item as any).id : ''
      const quantity = Number((item as any).quantity)

      if (!id) throw new Error(`Missing product id for item at index ${index}`)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        throw new Error(`Invalid quantity for item ${id} (max 10 per item)`)
      }

      const product = await getProductBySlug(id)
      if (!product) throw new Error(`Unknown product: ${id}`)

      return { product, quantity }
    })
  )
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

async function sendCustomerEmail(order: {
  orderId: string; name: string; email: string; items: Array<{ name: string; quantity: number; amountSubtotal: number }>; total: number; shipping: string
}) {
  const itemRows = order.items
    .map((item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;">${item.quantity}×</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e8e0d8;">${escapeHtml(item.name)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;text-align:right;">€${(item.amountSubtotal / 100).toFixed(2)}</td>
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
                  <p style="margin:8px 0 0;color:#c9b99a;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Request Received</p>
                </td>
              </tr>

              <tr>
                <td style="padding:40px 40px 24px;">
                  <p style="margin:0 0 16px;font-size:16px;">Hi ${escapeHtml(order.name)},</p>
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">
                    Thank you for your order request! We have noted everything and one of our team members will be in touch with you shortly.
                  </p>
                  <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#444;">
                    You will receive a <strong>secure payment link</strong> at this email address. Once you complete the payment, your handmade items from Hvar will be carefully packed and shipped to you.
                  </p>

                  <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Order reference</p>
                  <p style="margin:0 0 28px;font-family:monospace;font-size:13px;color:#555;background:#f5f0eb;padding:10px 14px;border-radius:4px;">${escapeHtml(order.orderId)}</p>

                  <h3 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Items you requested</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    ${itemRows}
                    <tr>
                      <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:15px;">Estimated total</td>
                      <td style="padding:14px 0 0;font-weight:bold;font-size:15px;text-align:right;">€${(order.total / 100).toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 40px 32px;">
                  <div style="background:#f5f0eb;border-radius:6px;padding:20px 24px;margin-top:24px;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:bold;">What happens next?</p>
                    <ol style="margin:0;padding-left:18px;font-size:14px;color:#555;line-height:1.8;">
                      <li>We'll send you a secure payment link at this email address.</li>
                      <li>Complete the payment through the link.</li>
                      <li>We pack and ship your items within 2–5 business days.</li>
                      <li>You'll receive a tracking number once your package is on its way.</li>
                    </ol>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background:#f5f0eb;padding:20px 40px;border-top:1px solid #e8e0d8;">
                  <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
                    This is an automated confirmation of your order request — it is not a payment receipt.
                    Please do not reply to this email. For questions, contact us at
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
    [order.email],
    `Made in Hvar — Your order request has been received (${order.orderId})`,
    html
  )
}

async function sendOwnerEmail(order: {
  orderId: string; name: string; email: string; phone: string; address: string
  shipping: string; notes: string; total: number
  items: Array<{ name: string; quantity: number; amountSubtotal: number }>
}) {
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL
  if (!notifyEmail) return

  const shippingLabel = SHIPPING_LABELS[order.shipping] ?? order.shipping

  const itemRows = order.items
    .map((item) => `
      <tr>
        <td style="padding:10px 16px 10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;font-weight:bold;">${item.quantity}×</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;">${escapeHtml(item.name)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:15px;text-align:right;">€${(item.amountSubtotal / 100).toFixed(2)}</td>
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
                  <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:22px;">New order request</h1>
                  <p style="margin:6px 0 0;color:#f5d5b8;font-size:13px;">Action required — send a Teya Pay by Link to the customer</p>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 40px;background:#fff8f0;border-bottom:2px solid #f5d5b8;">
                  <p style="margin:0;font-size:15px;color:#8B4513;">
                    <strong>Send a Teya Pay by Link for €${(order.total / 100).toFixed(2)} to
                    <a href="mailto:${escapeHtml(order.email)}" style="color:#8B4513;">${escapeHtml(order.email)}</a></strong>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Items ordered</h2>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemRows}
                    <tr>
                      <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:16px;">Total</td>
                      <td style="padding:14px 0 0;font-weight:bold;font-size:16px;text-align:right;color:#8B4513;">€${(order.total / 100).toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Ship to</h2>
                  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;">
                    <tr><td style="color:#888;width:130px;">Name</td><td style="font-weight:bold;">${escapeHtml(order.name)}</td></tr>
                    <tr><td style="color:#888;">Address</td><td>${escapeHtml(order.address)}</td></tr>
                    <tr><td style="color:#888;">Shipping</td><td>${escapeHtml(shippingLabel)}</td></tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Customer contact</h2>
                  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;">
                    <tr><td style="color:#888;width:130px;">Email</td><td><a href="mailto:${escapeHtml(order.email)}" style="color:#8B4513;">${escapeHtml(order.email)}</a></td></tr>
                    <tr><td style="color:#888;">Phone</td><td>${escapeHtml(order.phone)}</td></tr>
                  </table>
                </td>
              </tr>

              ${order.notes ? `
              <tr>
                <td style="padding:32px 40px 0;">
                  <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:17px;color:#8B4513;border-bottom:2px solid #e8e0d8;padding-bottom:10px;">Customer note</h2>
                  <p style="margin:0;font-size:14px;color:#444;line-height:1.6;white-space:pre-wrap;">${escapeHtml(order.notes)}</p>
                </td>
              </tr>` : ''}

              <tr>
                <td style="padding:32px 40px;">
                  <p style="margin:0;font-size:12px;color:#888;">Order reference: <span style="font-family:monospace;">${escapeHtml(order.orderId)}</span></p>
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
    `NEW ORDER REQUEST — ${order.name} — €${(order.total / 100).toFixed(2)}`,
    html
  )
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many order requests. Please wait an hour before trying again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()

    // Honeypot — bots fill this in, humans don't
    if (body._trap) {
      return NextResponse.json({ success: true })
    }

    const { items, shipping, email, name, phone, address, city, postalCode, country, notes, total } = body as {
      items: unknown; shipping: unknown; email: unknown; name: unknown; phone: unknown
      address: unknown; city: unknown; postalCode: unknown; country: unknown; notes: unknown; total?: unknown
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!isValidString(name) || !isValidString(phone) || !isValidString(address) || !isValidString(city) || !isValidString(postalCode) || !isValidString(country)) {
      return NextResponse.json({ error: 'All contact and shipping fields are required.' }, { status: 400 })
    }
    if ((name as string).trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }
    if ((name as string).length > 100) {
      return NextResponse.json({ error: 'Name too long (max 100 characters)' }, { status: 400 })
    }
    if ((email as string).length > 100) {
      return NextResponse.json({ error: 'Email too long' }, { status: 400 })
    }
    if (!/^\+\d{1,4} \d{4,20}$/.test((phone as string).trim())) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }
    if ((phone as string).length > 30) {
      return NextResponse.json({ error: 'Phone number too long' }, { status: 400 })
    }
    if ((address as string).trim().length < 5) {
      return NextResponse.json({ error: 'Please enter a valid street address' }, { status: 400 })
    }
    if ((address as string).length > 200) {
      return NextResponse.json({ error: 'Address too long (max 200 characters)' }, { status: 400 })
    }
    if ((city as string).trim().length < 2 || (city as string).length > 50) {
      return NextResponse.json({ error: 'Please enter a valid city (2–50 characters)' }, { status: 400 })
    }
    if (!/^\d{2,12}$/.test((postalCode as string).trim())) {
      return NextResponse.json({ error: 'Please enter a valid postal code (digits only)' }, { status: 400 })
    }
    if ((country as string).length > 100) {
      return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
    }
    if (typeof notes === 'string' && notes.length > 500) {
      return NextResponse.json({ error: 'Notes too long (max 500 characters)' }, { status: 400 })
    }
    if (typeof shipping !== 'string' || !(shipping in SHIPPING_RATES)) {
      return NextResponse.json({ error: 'Invalid shipping option' }, { status: 400 })
    }

    let lineItems: Awaited<ReturnType<typeof parseItems>>
    try {
      lineItems = await parseItems(items)
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const shippingCost = SHIPPING_RATES[shipping]
    const computedTotal = lineItems.reduce((sum, { product, quantity }) => sum + product!.price * quantity, shippingCost)

    if (typeof total === 'number' && total !== computedTotal) {
      return NextResponse.json({ error: 'Total mismatch detected' }, { status: 400 })
    }

    const orderId = `MIH-${Date.now()}`
    const customerAddress = `${(address as string).trim()}, ${(city as string).trim()}, ${(postalCode as string).trim()}, ${(country as string).trim()}`

    const orderData = {
      orderId,
      name: (name as string).trim(),
      email: email as string,
      phone: (phone as string).trim(),
      address: customerAddress,
      shipping: shipping as string,
      notes: typeof notes === 'string' ? notes.trim() : '',
      total: computedTotal,
      items: lineItems.map(({ product, quantity }) => ({
        name: product!.title,
        quantity,
        amountSubtotal: product!.price * quantity,
      })),
    }

    await Promise.all([
      sendCustomerEmail(orderData),
      sendOwnerEmail(orderData),
    ])

    return NextResponse.json({ success: true, orderId })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unable to submit order request' },
      { status: 500 }
    )
  }
}
