import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { assertStripeEnv, getStripe, updateFirestoreSubscription, getUserIdFromStripeCustomer } from '@/lib/stripe/server'

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
      console.error('❌ Missing signature or webhook secret')
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
      console.log('✅ Webhook signature verified:', event.type)
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
    }

    // Handle relevant events to manage access/entitlements
    switch (event.type) {
      case 'checkout.session.completed': {
        // Not used for Payment Element subscription, kept for completeness
        console.log('ℹ️ Checkout session completed (not used for Payment Element)')
        break
      }

      case 'invoice.paid': {
        // Grant/extend access until subscription.current_period_end
        const invoice = event.data.object as Stripe.Invoice
        console.log('💰 Invoice paid:', invoice.id)

        if (invoice.subscription && invoice.customer) {
          try {
            const stripe = getStripe()
            const subscription = await stripe.subscriptions.retrieve(
              invoice.subscription as string
            )

            // CustomerメタデータからFirebase UIDを取得
            const userId = await getUserIdFromStripeCustomer(invoice.customer as string)

            if (userId) {
              await updateFirestoreSubscription(userId, subscription)
              console.log(`✅ Subscription activated for user ${userId}`)
            } else {
              console.error('❌ Could not find Firebase UID for customer:', invoice.customer)
            }
          } catch (error) {
            console.error('❌ Error updating subscription on invoice.paid:', error)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        // Notify user and optionally restrict access
        const invoice = event.data.object as Stripe.Invoice
        console.log('⚠️ Invoice payment failed:', invoice.id)

        if (invoice.subscription && invoice.customer) {
          try {
            const stripe = getStripe()
            const subscription = await stripe.subscriptions.retrieve(
              invoice.subscription as string
            )

            const userId = await getUserIdFromStripeCustomer(invoice.customer as string)

            if (userId) {
              await updateFirestoreSubscription(userId, subscription)
              console.log(`⚠️ Subscription status updated (payment failed) for user ${userId}`)
              // TODO: ユーザーへのメール通知などを実装
            }
          } catch (error) {
            console.error('❌ Error handling payment failure:', error)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        // Sync status changes (canceled, past_due, unpaid, etc.)
        const subscription = event.data.object as Stripe.Subscription
        console.log('🔄 Subscription updated:', subscription.id)

        try {
          const userId = await getUserIdFromStripeCustomer(subscription.customer as string)

          if (userId) {
            await updateFirestoreSubscription(userId, subscription)
            console.log(`✅ Subscription status synced for user ${userId}:`, subscription.status)
          } else {
            console.error('❌ Could not find Firebase UID for customer:', subscription.customer)
          }
        } catch (error) {
          console.error('❌ Error updating subscription:', error)
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription
        console.log('🗑️ Subscription deleted:', subscription.id)

        try {
          const userId = await getUserIdFromStripeCustomer(subscription.customer as string)

          if (userId) {
            await updateFirestoreSubscription(userId, subscription)
            console.log(`✅ Subscription canceled for user ${userId}`)
          } else {
            console.error('❌ Could not find Firebase UID for customer:', subscription.customer)
          }
        } catch (error) {
          console.error('❌ Error handling subscription deletion:', error)
        }
        break
      }

      default:
        // Log unknown events for debugging
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
        break
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('❌ Webhook error:', err)
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}
