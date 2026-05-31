import Stripe from 'stripe'

const STRIPE_API_VERSION = '2022-11-15'

export function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    throw new Error(
      'Stripe secret key is not configured. Set STRIPE_SECRET_KEY in your server environment.'
    )
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: STRIPE_API_VERSION
  })
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
