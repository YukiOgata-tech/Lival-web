import Stripe from 'stripe'

let cachedStripe: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY env')
  if (!cachedStripe) {
    cachedStripe = new Stripe(key, { apiVersion: '2024-06-20' })
  }
  return cachedStripe
}

export function assertStripeEnv() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY env')
  }
}
