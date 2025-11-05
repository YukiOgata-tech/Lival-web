import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const safeCount = async (col: any, whereFilter?: [string, any, unknown]) => {
      try {
        if (whereFilter) {
          // @ts-ignore admin aggregate count
          const agg = await col.where(whereFilter[0], whereFilter[1], whereFilter[2]).count().get()
          return agg.data().count || 0
        } else {
          // @ts-ignore admin aggregate count
          const agg = await col.count().get()
          return agg.data().count || 0
        }
      } catch {
        // Fallback: paginate count
        let total = 0
        let q = whereFilter
          ? col.where(whereFilter[0], whereFilter[1], whereFilter[2]).orderBy('__name__').limit(1000)
          : col.orderBy('__name__').limit(1000)
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const snap = await q.get()
          if (snap.empty) break
          total += snap.size
          const last = snap.docs[snap.docs.length - 1]
          q = q.startAfter(last).limit(1000)
          if (total > 200000) break
        }
        return total
      }
    }

    const usersCol = adminDb.collection('users')
    const blogsCol = adminDb.collection('blogs')
    const [
      totalUsers,
      totalBlogs,
      approved,
      pending,
      rejected,
      revise,
      draft,
    ] = await Promise.all([
      safeCount(usersCol),
      safeCount(blogsCol),
      safeCount(blogsCol, ['status', '==', 'approved']),
      safeCount(blogsCol, ['status', '==', 'pending']),
      safeCount(blogsCol, ['status', '==', 'rejected']),
      safeCount(blogsCol, ['status', '==', 'revise']),
      safeCount(blogsCol, ['status', '==', 'draft']),
    ])

    return NextResponse.json({
      ok: true,
      totalUsers,
      blogs: { total: totalBlogs, approved, pending, rejected, revise, draft },
    })
  } catch (e) {
    console.error('Admin stats error:', e)
    return NextResponse.json({ ok: false, error: 'failed_to_fetch' }, { status: 500 })
  }
}
