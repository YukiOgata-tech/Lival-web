import { NextResponse } from 'next/server'
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

// 管理者権限チェック
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const db = getFirestore()
    const userDoc = await db.collection('users').doc(userId).get()

    if (!userDoc.exists) return false

    const userData = userDoc.data()
    return userData?.role === 'admin' || false
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}

export async function GET(req: Request) {
  try {
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

    // 管理者権限チェック
    const adminCheck = await isAdmin(userId)
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // クエリパラメータ取得
    const url = new URL(req.url)
    const plan = url.searchParams.get('plan') // 'all', 'basic', 'premium'
    const status = url.searchParams.get('status') // 'active', 'canceled', 'past_due', 'trial'
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Firestoreからサブスクリプション契約者を取得
    const db = getFirestore()
    let query = db.collection('users')

    // プランでフィルタリング
    if (plan && plan !== 'all') {
      query = query.where('subscription.plan', '==', plan) as any
    } else {
      // free_web以外（有料プラン契約者のみ）
      query = query.where('subscription.plan', 'in', ['basic', 'premium']) as any
    }

    // ステータスでフィルタリング
    if (status) {
      query = query.where('subscription.status', '==', status) as any
    }

    // 並び替え（作成日時の新しい順）
    query = query.orderBy('createdAt', 'desc') as any

    // ページネーション
    if (offset > 0) {
      query = query.offset(offset) as any
    }
    query = query.limit(limit) as any

    const snapshot = await query.get()

    // データ整形
    const subscribers = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email,
        displayName: data.displayName,
        subscription: {
          plan: data.subscription?.plan,
          status: data.subscription?.status,
          currentPeriodStart: data.subscription?.currentPeriodStart?.toDate().toISOString(),
          currentPeriodEnd: data.subscription?.currentPeriodEnd?.toDate().toISOString(),
          cancelAt: data.subscription?.cancelAt?.toDate().toISOString() || null,
          stripeCustomerId: data.subscription?.stripeCustomerId,
          stripeSubscriptionId: data.subscription?.stripeSubscriptionId,
        },
        createdAt: data.createdAt?.toDate().toISOString(),
        webProfile: {
          lastWebLogin: data.webProfile?.lastWebLogin?.toDate().toISOString(),
        }
      }
    })

    // 総数取得（パフォーマンスのため別クエリ）
    let countQuery = db.collection('users')
    if (plan && plan !== 'all') {
      countQuery = countQuery.where('subscription.plan', '==', plan) as any
    } else {
      countQuery = countQuery.where('subscription.plan', 'in', ['basic', 'premium']) as any
    }
    if (status) {
      countQuery = countQuery.where('subscription.status', '==', status) as any
    }
    const countSnapshot = await countQuery.count().get()
    const total = countSnapshot.data().count

    console.log(`✅ Admin retrieved ${subscribers.length} subscribers (total: ${total})`)

    return NextResponse.json({
      subscribers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + subscribers.length < total
      }
    })
  } catch (err: any) {
    console.error('Get subscribers error:', err)
    const message = err?.message || 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
