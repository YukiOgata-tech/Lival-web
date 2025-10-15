'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, limit, query, Timestamp, startAfter, where, DocumentSnapshot } from 'firebase/firestore'
import { FileBarChart, RefreshCw, Inbox, Loader2 } from 'lucide-react'

type Req = {
  id: string
  uid?: string
  displayName?: string | null
  email?: string | null
  text: string
  page?: string
  createdAt?: Timestamp | null
}

export default function FeatureSurveyResults({ page = 'enterprise', max = 50, pageSize = 10 }: { page?: string; max?: number; pageSize?: number }) {
  const [items, setItems] = useState<Req[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [occupation, setOccupation] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cursors, setCursors] = useState<Array<DocumentSnapshot | null>>([null])

  const buildQuery = (start: DocumentSnapshot | null) => {
    const colRef = collection(db, 'enterprise_feature_requests')
    const clauses: any[] = [orderBy('createdAt', 'desc')]
    if (page) clauses.unshift(where('page', '==', page))
    if (occupation) clauses.unshift(where('occupation', '==', occupation))
    let q = query(colRef, ...clauses, limit(pageSize))
    if (start) {
      q = query(colRef, ...clauses, startAfter(start), limit(pageSize))
    }
    return q
  }

  const loadPage = async (pageIndex: number) => {
    setLoading(true)
    setError(null)
    try {
      const startDoc = cursors[pageIndex] || null
      const q = buildQuery(startDoc)
      const snap = await getDocs(q)
      const rows: Req[] = []
      snap.forEach((doc) => rows.push({ id: doc.id, ...(doc.data() as any) }))
      setItems(rows)
      // set next cursor (last doc of this page)
      const last = snap.docs[snap.docs.length - 1] || null
      const nextCursors = cursors.slice(0, pageIndex + 1)
      nextCursors[pageIndex + 1] = last
      setCursors(nextCursors)
      setCurrentPage(pageIndex)
    } catch (e) {
      console.error('Failed to load survey results', e)
      setError('読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 初回とフィルタ変更時
  useEffect(() => {
    setCursors([null])
    setCurrentPage(0)
    loadPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, occupation, pageSize])

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <FileBarChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">機能要望（エンタープライズ）</h3>
            <p className="text-xs text-gray-500 mt-0.5">1ページ {pageSize} 件</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 py-1.5"
            aria-label="職業フィルタ"
          >
            <option value="">すべての職業</option>
            <option value="中学教員">中学教員</option>
            <option value="高校教員">高校教員</option>
            <option value="大学教職員">大学教職員</option>
            <option value="学校職員">学校職員</option>
            <option value="塾講師">塾講師</option>
            <option value="学習塾運営">学習塾運営</option>
            <option value="保護者">保護者</option>
            <option value="学生">学生</option>
            <option value="社会人">社会人</option>
            <option value="その他">その他</option>
          </select>
          <button
            onClick={() => loadPage(currentPage)}
            disabled={loading}
            className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />} 更新
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      {items.length === 0 && !loading ? (
        <div className="flex items-center justify-center text-gray-500 text-sm py-8">
          <Inbox className="w-4 h-4 mr-2" /> 要望はまだありません
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((it) => (
            <li key={it.id} className="py-3 sm:py-4">
              <div className="text-gray-900 text-sm sm:text-base whitespace-pre-wrap break-words">{it.text}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {typeof (it as any).age === 'number' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">年齢 {(it as any).age}</span>
                )}
                {(it as any).occupation && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs">{(it as any).occupation}</span>
                )}
                {typeof (it as any).isSubscriber === 'boolean' && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                    (it as any).isSubscriber ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {(it as any).isSubscriber ? 'サブスク: 利用中' : 'サブスク: 未利用'}
                  </span>
                )}
                {it.displayName && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{it.displayName}</span>
                )}
                {it.email && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{it.email}</span>
                )}
                {it.createdAt?.toDate && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs">
                    {it.createdAt.toDate().toLocaleString('ja-JP', { hour12: false })}
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-xs">ID: {it.id.slice(0, 8)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-xs sm:text-sm">
        <button
          onClick={() => currentPage > 0 && loadPage(currentPage - 1)}
          disabled={loading || currentPage === 0}
          className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 disabled:text-gray-400 disabled:border-gray-200"
        >
          前へ
        </button>
        <div className="text-gray-600">ページ {currentPage + 1}</div>
        <button
          onClick={() => items.length === pageSize && loadPage(currentPage + 1)}
          disabled={loading || items.length < pageSize}
          className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 disabled:text-gray-400 disabled:border-gray-200"
        >
          次へ
        </button>
      </div>
    </div>
  )
}
