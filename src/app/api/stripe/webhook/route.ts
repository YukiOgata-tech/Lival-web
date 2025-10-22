import { NextResponse } from 'next/server'
import { assertStripeEnv, stripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Ensure the request body is read as raw text for signature verification
export async function POST(req: Request) {
  try {
    assertStripeEnv()
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err: any) {
      return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
    }

    // Handle relevant events to manage access/entitlements
    switch (event.type) {
      case 'checkout.session.completed': {
        // Not used for Payment Element subscription, kept for completeness
        break
      }
      case 'invoice.paid': {
        // Grant/extend access until subscription.current_period_end
        const invoice = event.data.object
        // TODO: Update your user/subscription record in Supabase/Firestore
        // using invoice.customer / invoice.subscription
        break
      }
      case 'invoice.payment_failed': {
        // Optional: notify and keep access until current period end
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Sync status changes (canceled, past_due, unpaid)
        const sub = event.data.object
        // TODO: Reflect status to your DB
        break
      }
      default:
        // Ignore other events
        break
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}

