import Stripe from 'stripe'

// Initialize Stripe server SDK
// STRIPE_SECRET_KEY must be set in .env.local (never commit secrets)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export function assertStripeEnv() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY env')
  }
}

