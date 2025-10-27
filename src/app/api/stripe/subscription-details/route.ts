import { NextResponse } from 'next/server'
import { assertStripeEnv, getStripe } from '@/lib/stripe/server'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Firebase Admin初期化
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

export async function GET(req: Request) {
  try {
    assertStripeEnv()

    // 認証チェック
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    let decodedToken

    try {
      decodedToken = await getAuth().verifyIdToken(idToken)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decodedToken.uid

    // Firestoreからユーザー情報取得
    const db = getFirestore()
    const userDoc = await db.collection('users').doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const customerId = userData?.subscription?.stripeCustomerId
    const subscriptionId = userData?.subscription?.stripeSubscriptionId

    if (!customerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      )
    }

    const stripe = getStripe()

    // カード情報を取得
    let paymentMethod = null
    if (subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const defaultPaymentMethodId = subscription.default_payment_method

        if (defaultPaymentMethodId && typeof defaultPaymentMethodId === 'string') {
          const pm = await stripe.paymentMethods.retrieve(defaultPaymentMethodId)
          if (pm.card) {
            paymentMethod = {
              brand: pm.card.brand,
              last4: pm.card.last4,
              expMonth: pm.card.exp_month,
              expYear: pm.card.exp_year
            }
          }
        }
      } catch (error) {
        console.error('Error fetching payment method:', error)
      }
    }

    // 請求履歴を取得（最新10件）
    let invoices: any[] = []
    try {
      const invoiceList = await stripe.invoices.list({
        customer: customerId,
        limit: 10
      })

      invoices = invoiceList.data.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount_paid,  // 実際に支払われた金額
        amountDue: invoice.amount_due,  // 請求予定金額（draft用）
        currency: invoice.currency,
        status: invoice.status,
        created: invoice.created,
        pdfUrl: invoice.invoice_pdf,
        hostedUrl: invoice.hosted_invoice_url,
        periodStart: invoice.period_start,
        periodEnd: invoice.period_end
      }))
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }

    return NextResponse.json({
      paymentMethod,
      invoices
    })
  } catch (err: any) {
    console.error('Subscription details error:', err)
    const message = err?.message || 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
