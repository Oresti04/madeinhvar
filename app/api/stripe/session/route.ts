import { NextResponse } from 'next/server'
import { getStripe } from '../../../../lib/stripe'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'Missing session_id query parameter' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    })

    if (!session) {
      return NextResponse.json({ error: 'Stripe session not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: session.id,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_email,
      customerName: session.metadata?.customerName ?? null,
      customerPhone: session.metadata?.customerPhone ?? null,
      customerAddress: session.metadata?.customerAddress ?? null,
      country: session.metadata?.country ?? null,
      city: session.metadata?.city ?? null,
      postalCode: session.metadata?.postalCode ?? null,
      notes: session.metadata?.notes ?? null,
      shipping: session.metadata?.shipping ?? null,
      lineItems: session.line_items?.data.map((item) => {
        const productName =
          typeof item.price?.product === 'object' &&
          item.price.product !== null &&
          'name' in item.price.product
            ? item.price.product.name
            : undefined

        return {
          name: item.description || productName || item.price?.nickname || 'Product',
          quantity: item.quantity,
          amountSubtotal: item.amount_subtotal
        }
      }) ?? []
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unable to retrieve Stripe session' },
      { status: 500 }
    )
  }
}
