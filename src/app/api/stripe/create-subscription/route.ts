import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { assertStripeEnv, getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CreateSubscriptionBody = {
  priceId: string
  customerId?: string
  email?: string
}

export async function POST(req: Request) {
  try {
    assertStripeEnv()

    const body = (await req.json()) as CreateSubscriptionBody
    const { priceId, customerId, email } = body || {}

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
    }

    // 1) Ensure customer
    let customerIdResolved = customerId
    if (!customerIdResolved) {
      const customer = await stripe.customers.create({
        email,
        // NOTE: In production, link your auth userId here via metadata
        // metadata: { userId }
      })
      customerIdResolved = customer.id
    }

    // 2) Create subscription in incomplete state to get a PaymentIntent client_secret
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.create({
      customer: customerIdResolved,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null
    const paymentIntent = latestInvoice?.payment_intent as Stripe.PaymentIntent | null
    const clientSecret = paymentIntent?.client_secret

    if (!clientSecret) {
      return NextResponse.json(
        { error: 'client_secret not available from subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customerIdResolved,
      status: subscription.status,
    })
  } catch (err: any) {
    const message = err?.message || 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
