import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { assertStripeEnv, getStripe, getOrCreateStripeCustomer } from '@/lib/stripe/server'
import { auth } from '@/lib/firebase'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Firebase Admin初期化（サーバーサイド専用）
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

type CreateSubscriptionBody = {
  priceId: string
  userId: string
}

export async function POST(req: Request) {
  try {
    assertStripeEnv()

    // 認証トークンを確認
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

    const body = (await req.json()) as CreateSubscriptionBody
    const { priceId, userId } = body || {}

    // リクエストのuserIdとトークンのuidが一致するか確認
    if (!userId || userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
    }

    // Stripe Customerを取得または作成（Firebase UIDと紐付け）
    const customerIdResolved = await getOrCreateStripeCustomer(
      userId,
      decodedToken.email || '',
      decodedToken.name
    )

    const stripe = getStripe()

    // 既存のアクティブなサブスクリプションをチェック
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerIdResolved,
      status: 'active',
      limit: 1
    })

    if (existingSubscriptions.data.length > 0) {
      return NextResponse.json(
        {
          error: 'すでにアクティブなサブスクリプションが存在します。プラン変更はサブスクリプション管理ページから行ってください。',
          hasActiveSubscription: true
        },
        { status: 400 }
      )
    }

    // Firestoreからユーザー情報取得（トライアル使用済みチェック）
    const db = getFirestore()
    const userDoc = await db.collection('users').doc(userId).get()
    const userData = userDoc.data()
    const hasUsedTrial = userData?.subscription?.hasUsedTrial || false

    // Premiumプランでトライアル適用判定
    const isPremiumPlan = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM
    const shouldApplyTrial = isPremiumPlan && !hasUsedTrial

    // サブスクリプションを作成（incomplete状態）
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customerIdResolved,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        firebaseUID: userId,
        platform: 'web'
      },
      // 請求書を日本語化
      default_tax_rates: [],  // 税率が必要な場合は後で追加
    }

    // トライアル期間を設定（Premiumプランで初回のみ）
    if (shouldApplyTrial) {
      subscriptionParams.trial_period_days = 3  // 3日間無料トライアル
      console.log(`🎁 Applying 3-day trial for user ${userId}`)
    }

    const subscription = await stripe.subscriptions.create(subscriptionParams)

    // トライアルを適用した場合、Firestoreにフラグを設定
    if (shouldApplyTrial) {
      await db.collection('users').doc(userId).update({
        'subscription.hasUsedTrial': true,
        updatedAt: new Date()
      })
      console.log(`✅ Trial flag set for user ${userId}`)
    }

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null
    const paymentIntent = latestInvoice?.payment_intent as Stripe.PaymentIntent | null
    const clientSecret = paymentIntent?.client_secret

    if (!clientSecret) {
      return NextResponse.json(
        { error: 'client_secret not available from subscription' },
        { status: 500 }
      )
    }

    console.log(`✅ Subscription created for user ${userId}:`, subscription.id)

    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customerIdResolved,
      status: subscription.status,
      isTrialing: shouldApplyTrial,  // フロントエンドに通知
      trialEnd: shouldApplyTrial ? subscription.trial_end : null
    })
  } catch (err: any) {
    console.error('Subscription creation error:', err)
    const message = err?.message || 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
