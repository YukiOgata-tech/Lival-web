import { NextResponse } from 'next/server'
import { assertStripeEnv, getStripe, updateFirestoreSubscription } from '@/lib/stripe/server'
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

export async function POST(req: Request) {
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
    const subscriptionId = userData?.subscription?.stripeSubscriptionId

    if (!subscriptionId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    // キャンセル予定が設定されているか確認
    if (!userData?.subscription?.cancelAt) {
      return NextResponse.json({ error: 'Subscription is not scheduled for cancellation' }, { status: 400 })
    }

    // Stripeでサブスクリプションを再開（キャンセル予定を解除）
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false  // キャンセル予定を解除
    })

    // Firestoreを更新
    await updateFirestoreSubscription(userId, subscription)

    console.log(`✅ Subscription resumed for user ${userId}:`, subscriptionId)

    return NextResponse.json({
      success: true,
      message: 'Subscription has been resumed',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      }
    })
  } catch (err: any) {
    console.error('Resume subscription error:', err)
    const message = err?.message || 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
