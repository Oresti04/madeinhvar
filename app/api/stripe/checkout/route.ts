import { NextResponse } from 'next/server'
import { getProductBySlug } from '../../../../lib/products'
import { getStripe, getSiteUrl } from '../../../../lib/stripe'

const SHIPPING_RATES: Record<string, number> = {
  croatia: 500,
  eu: 1200,
  world: 2000
}

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

async function parseItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('No items provided')
  }

  return Promise.all(
    value.map(async (item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Invalid item at index ${index}`)
      }

      const id = typeof (item as any).id === 'string' ? (item as any).id : ''
      const quantity = Number((item as any).quantity)

      if (!id) throw new Error(`Missing product id for item at index ${index}`)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        throw new Error(`Invalid quantity for item ${id}`)
      }

      const product = await getProductBySlug(id)
      if (!product) throw new Error(`Unknown product: ${id}`)

      return { product, quantity }
    })
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, shipping, email, name, phone, address, city, postalCode, country, notes, total } = body as {
      items: unknown; shipping: unknown; email: unknown; name: unknown; phone: unknown
      address: unknown; city: unknown; postalCode: unknown; country: unknown; notes: unknown; total?: unknown
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!isValidString(name) || !isValidString(phone) || !isValidString(address) || !isValidString(city) || !isValidString(postalCode) || !isValidString(country)) {
      return NextResponse.json({ error: 'All shipping and contact fields are required.' }, { status: 400 })
    }
    if (typeof shipping !== 'string' || !(shipping in SHIPPING_RATES)) {
      return NextResponse.json({ error: 'Invalid shipping option' }, { status: 400 })
    }

    let lineItems
    try {
      lineItems = await parseItems(items)
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const shippingCost = SHIPPING_RATES[shipping]
    const line_items = lineItems.map(({ product, quantity }) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: product.title, description: product.description || 'Handmade product' },
        unit_amount: product.price
      },
      quantity
    }))

    line_items.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Shipping', description: `Shipping option: ${shipping}` },
        unit_amount: shippingCost
      },
      quantity: 1
    })

    const computedTotal = line_items.reduce((sum, item) => sum + Number(item.price_data.unit_amount) * item.quantity, 0)
    if (typeof total === 'number' && total !== computedTotal) {
      return NextResponse.json({ error: 'Total mismatch detected' }, { status: 400 })
    }

    const stripe = getStripe()
    const customerAddress = `${(address as string).trim()}, ${(city as string).trim()}, ${(postalCode as string).trim()}, ${(country as string).trim()}`
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${getSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getSiteUrl()}/cart`,
      customer_email: email,
      metadata: {
        shipping,
        customerName: (name as string).trim(),
        customerPhone: (phone as string).trim(),
        customerAddress,
        city: (city as string).trim(),
        postalCode: (postalCode as string).trim(),
        country: (country as string).trim(),
        notes: typeof notes === 'string' ? notes.trim().slice(0, 500) : ''
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unable to create Stripe checkout session' },
      { status: 500 }
    )
  }
}
