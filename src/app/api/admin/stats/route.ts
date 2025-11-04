import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, where, query } from 'firebase/firestore'
// @ts-ignore - available in firebase/firestore v9 for server runtime
import { getCountFromServer } from 'firebase/firestore'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // 優先: Admin SDK の集計（同一プロジェクトを確実に参照）
    if (adminDb) {
      // 安全なカウント: まず aggregate count（対応環境）、失敗時はページングで手動カウント
      const safeCount = async (col: any, whereFilter?: [string, any, unknown]) => {
        try {
          if (whereFilter) {
            // @ts-ignore admin SDK aggregate count API（対応環境のみ）
            const agg = await col.where(whereFilter[0], whereFilter[1], whereFilter[2]).count().get()
            return agg.data().count || 0
          } else {
            // @ts-ignore admin SDK aggregate count API
            const agg = await col.count().get()
            return agg.data().count || 0
          }
        } catch {
          // 手動カウント（__name__ ソートでページング）
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
            if (total > 200000) break // safety guard
          }
          return total
        }
      }

      const usersCol = adminDb.collection('users')
      const blogsCol = adminDb.collection('blogs')
      const [totalUsers, totalBlogs, approved, pending, rejected] = await Promise.all([
        safeCount(usersCol),
        safeCount(blogsCol),
        safeCount(blogsCol, ['status', '==', 'approved']),
        safeCount(blogsCol, ['status', '==', 'pending']),
        safeCount(blogsCol, ['status', '==', 'rejected']),
      ])
      return NextResponse.json({ ok: true, totalUsers, blogs: { total: totalBlogs, approved, pending, rejected } })
    }

    // Fallback: Web SDK の getCountFromServer（NEXT_PUBLIC_* が正しく設定されていることが前提）
    const usersCol = collection(db, 'users')
    const blogsCol = collection(db, 'blogs')

    const [usersSnap, totalSnap, approvedSnap, pendingSnap, rejectedSnap] = await Promise.all([
      getCountFromServer(usersCol),
      getCountFromServer(blogsCol),
      getCountFromServer(query(blogsCol, where('status', '==', 'approved'))),
      getCountFromServer(query(blogsCol, where('status', '==', 'pending'))),
      getCountFromServer(query(blogsCol, where('status', '==', 'rejected')))
    ])

    const totalUsers = usersSnap.data().count || 0
    const totalBlogs = totalSnap.data().count || 0
    const approved = approvedSnap.data().count || 0
    const pending = pendingSnap.data().count || 0
    const rejected = rejectedSnap.data().count || 0

    return NextResponse.json({
      ok: true,
      totalUsers,
      blogs: {
        total: totalBlogs,
        approved,
        pending,
        rejected,
      },
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'failed_to_fetch' }, { status: 500 })
  }
}
