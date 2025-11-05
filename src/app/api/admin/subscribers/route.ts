import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Check admin role from Firestore users/{uid}
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get()
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
    // Require Firebase ID token
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.substring('Bearer '.length)
    let decodedToken
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decodedToken.uid
    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Query params
    const url = new URL(req.url)
    const plan = url.searchParams.get('plan') // 'all', 'basic', 'premium'
    const status = url.searchParams.get('status') // 'active', 'canceled', 'past_due', 'trial'
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Build query (Admin SDK)
    let q: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb.collection('users')
    if (plan && plan !== 'all') {
      q = q.where('subscription.plan', '==', plan)
    } else {
      q = q.where('subscription.plan', 'in', ['basic', 'premium'])
    }
    if (status) {
      q = q.where('subscription.status', '==', status)
    }
    q = q.orderBy('createdAt', 'desc')
    if (offset > 0) q = q.offset(offset)
    q = q.limit(limit)

    const snapshot = await q.get()
    const subscribers = snapshot.docs.map((doc) => {
      const data: any = doc.data()
      return {
        id: doc.id,
        email: data.email,
        displayName: data.displayName,
        subscription: {
          plan: data.subscription?.plan,
          status: data.subscription?.status,
          currentPeriodStart: data.subscription?.currentPeriodStart?.toDate?.().toISOString?.(),
          currentPeriodEnd: data.subscription?.currentPeriodEnd?.toDate?.().toISOString?.(),
          cancelAt: data.subscription?.cancelAt?.toDate?.().toISOString?.() || null,
          stripeCustomerId: data.subscription?.stripeCustomerId,
          stripeSubscriptionId: data.subscription?.stripeSubscriptionId,
        },
        createdAt: data.createdAt?.toDate?.().toISOString?.(),
        webProfile: {
          lastWebLogin: data.webProfile?.lastWebLogin?.toDate?.().toISOString?.(),
        },
      }
    })

    // Count total
    let total = 0
    try {
      let cq: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb.collection('users')
      if (plan && plan !== 'all') cq = cq.where('subscription.plan', '==', plan)
      else cq = cq.where('subscription.plan', 'in', ['basic', 'premium'])
      if (status) cq = cq.where('subscription.status', '==', status)
      // @ts-ignore: count() available in recent Admin SDK
      const agg = await (cq as any).count().get()
      total = agg.data().count || 0
    } catch {
      // Fallback: paginate to count
      let cq: any = adminDb.collection('users')
      if (plan && plan !== 'all') cq = cq.where('subscription.plan', '==', plan)
      else cq = cq.where('subscription.plan', 'in', ['basic', 'premium'])
      if (status) cq = cq.where('subscription.status', '==', status)
      cq = cq.orderBy('__name__').limit(1000)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const snap = await cq.get()
        if (snap.empty) break
        total += snap.size
        const last = snap.docs[snap.docs.length - 1]
        cq = cq.startAfter(last).limit(1000)
        if (total > 200000) break
      }
    }

    return NextResponse.json({
      subscribers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + subscribers.length < total,
      },
    })
  } catch (err: any) {
    console.error('Get subscribers error:', err)
    const message = err?.message || 'failed_to_fetch'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

