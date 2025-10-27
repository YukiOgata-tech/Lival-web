import { NextResponse } from 'next/server'
import { assertStripeEnv, getStripe, getOrCreateStripeCustomer } from '@/lib/stripe/server'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

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

type CreateSetupIntentBody = {
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

    const body = (await req.json()) as CreateSetupIntentBody
    const { userId } = body || {}

    // リクエストのuserIdとトークンのuidが一致するか確認
    if (!userId || userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Stripe Customerを取得または作成
    const customerId = await getOrCreateStripeCustomer(
      userId,
      decodedToken.email || '',
      decodedToken.name
    )

    // SetupIntentを作成（カード情報を保存するため）
    const stripe = getStripe()
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        firebaseUID: userId,
        purpose: 'update_payment_method'
      }
    })

    if (!setupIntent.client_secret) {
      return NextResponse.json(
        { error: 'client_secret not available from SetupIntent' },
        { status: 500 }
      )
    }

    console.log(`✅ SetupIntent created for user ${userId}:`, setupIntent.id)

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    })
  } catch (err: any) {
    console.error('SetupIntent creation error:', err)
    const message = err?.message || 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
