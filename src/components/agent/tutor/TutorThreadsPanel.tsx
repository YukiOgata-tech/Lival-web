'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { deleteThreadImages } from '@/lib/tutorImageStorage'

export type TutorThread = {
  id: string
  title: string
  updatedAt: number
}

function storageKey(uid: string | null) { return `lival_chat_threads_${uid ?? 'guest'}` }

export default function TutorThreadsPanel({
  uid,
  onOpen,
  onCreate,
}: {
  uid: string | null
  onOpen: (id: string) => void
  onCreate: () => void
}) {
  const [threads, setThreads] = useState<TutorThread[]>([])
  const [queryText, setQueryText] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const local = JSON.parse(localStorage.getItem(storageKey(uid)) || '[]') as TutorThread[]
        let list = local
        if (uid) {
          const col = collection(db, 'users', uid, 'eduAI_threads')
          const q = query(col, orderBy('updatedAt', 'desc'), limit(50))
          const snap = await getDocs(q)
          const remote = snap.docs.map((d) => {
            const v = d.data() as any
            if (v.archived) return null
            return { id: d.id, title: v.title || 'Tutor スレッド', updatedAt: v.updatedAt?.toMillis?.() || Date.now() } as TutorThread
          }).filter(Boolean) as TutorThread[]
          const map = new Map<string, TutorThread>()
          ;[...remote, ...list].forEach((t) => { const prev = map.get(t.id); if (!prev || t.updatedAt > prev.updatedAt) map.set(t.id, t) })
          list = Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt)
          localStorage.setItem(storageKey(uid), JSON.stringify(list))
        }
        setThreads(list)
      } catch {
        setThreads([])
      }
    }
    load()
  }, [uid])

  const filtered = (queryText.trim() ? threads.filter(t => (t.title||'').toLowerCase().includes(queryText.trim().toLowerCase())) : threads)

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <input
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="スレッドを検索"
          className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button onClick={onCreate} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">新規スレッド</button>
      </div>
      {filtered.length === 0 && (
        <div className="rounded-md border bg-white p-6 text-center text-sm text-gray-600">スレッドがありません。右上の「新規スレッド」から作成できます。</div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <div key={t.id} className="rounded-lg border bg-white p-3 shadow-sm transition hover:shadow">
            <button onClick={() => onOpen(t.id)} className="block w-full text-left">
              <div className="truncate text-sm font-semibold text-gray-900">{t.title || 'Tutor スレッド'}</div>
              <div className="mt-1 text-xs text-gray-500">{new Date(t.updatedAt).toLocaleString()}</div>
            </button>
            <div className="mt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={async () => {
                  const title = prompt('スレッド名を変更', t.title)
                  if (title == null) return
                  try {
                    const key = storageKey(uid)
                    const local = JSON.parse(localStorage.getItem(key) || '[]') as TutorThread[]
                    const next = local.map((x) => x.id === t.id ? { ...x, title } : x)
                    localStorage.setItem(key, JSON.stringify(next))
                    if (uid) {
                      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
                      const { db } = await import('@/lib/firebase')
                      await setDoc(doc(db, 'users', uid, 'eduAI_threads', t.id), { title, updatedAt: serverTimestamp() }, { merge: true })
                    }
                    setThreads((prev) => prev.map((x) => x.id === t.id ? { ...x, title } : x))
                  } catch {}
                }}
                className="rounded border px-2 py-1 text-gray-700 hover:bg-gray-50"
              >名前変更</button>
              <button
                onClick={async () => {
                  if (!confirm('このスレッドを削除（アーカイブ）しますか？')) return
                  try {
                    const key = storageKey(uid)
                    const local = JSON.parse(localStorage.getItem(key) || '[]') as TutorThread[]
                    const next = local.filter((x) => x.id !== t.id)
                    localStorage.setItem(key, JSON.stringify(next))
                    if (uid) {
                      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
                      const { db } = await import('@/lib/firebase')
                      await setDoc(doc(db, 'users', uid, 'eduAI_threads', t.id), { archived: true, deletedAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
                      // Storage 内の画像削除（仕様に準拠）
                      try { await deleteThreadImages(t.id) } catch {}
                    }
                    setThreads((prev) => prev.filter((x) => x.id !== t.id))
                  } catch {}
                }}
                className="rounded border px-2 py-1 text-red-600 hover:bg-red-50 border-red-200"
              >削除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
