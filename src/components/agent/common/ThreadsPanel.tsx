'use client'

import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, limit, orderBy, query, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export type AgentKind = 'planner' | 'tutor' | 'counselor'

export type AnyThread = {
  id: string
  title: string
  agent: AgentKind
  updatedAt: number
  lastMessage?: string
}

function storageKey(uid: string | null) { return `lival_chat_threads_${uid ?? 'guest'}` }

export default function ThreadsPanel({
  uid,
  initialFilter = 'all',
  onOpen,
  onCreate,
  showCreateButton = true,
}: {
  uid: string | null
  initialFilter?: 'all' | AgentKind
  onOpen: (agent: AgentKind, id: string) => void
  onCreate: (agent: AgentKind) => Promise<void> | void
  showCreateButton?: boolean
}) {
  const [threads, setThreads] = useState<AnyThread[]>([])
  const [queryText, setQueryText] = useState('')
  const [filter, setFilter] = useState<'all' | AgentKind>(initialFilter)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const local = JSON.parse(localStorage.getItem(storageKey(uid)) || '[]') as AnyThread[]
        let list = local
        if (uid) {
          const col = collection(db, 'users', uid, 'eduAI_threads')
          const q = query(col, orderBy('updatedAt', 'desc'), limit(100))
          const snap = await getDocs(q)
          const remote = await Promise.all(snap.docs.map(async (d) => {
            const v = d.data() as any
            if (v.archived) return null
            
            // 最後のAIメッセージを取得
            let lastMessage = ''
            try {
              const messagesCol = collection(d.ref, 'messages')
              const messagesQuery = query(messagesCol, orderBy('createdAt', 'desc'), limit(5))
              const messagesSnap = await getDocs(messagesQuery)
              
              // assistantの最後のメッセージを探す
              for (const messageDoc of messagesSnap.docs) {
                const messageData = messageDoc.data()
                if (messageData.role === 'assistant' || messageData.agent) {
                  const content = messageData.content || ''
                  // プランカード形式は除外し、通常のテキストメッセージのみ表示
                  if (!content.startsWith('__PLAN_CARD__')) {
                    lastMessage = content.length > 60 ? content.substring(0, 60) + '...' : content
                    break
                  }
                }
              }
            } catch (error) {
              console.warn('Failed to fetch last message for thread:', d.id, error)
            }
            
            return {
              id: d.id,
              title: v.title || `${v.agent || 'thread'}`,
              agent: (v.agent || 'planner') as AgentKind,
              updatedAt: v.updatedAt?.toMillis?.() || Date.now(),
              lastMessage,
            } as AnyThread
          }))
          const filteredRemote = remote.filter(Boolean) as AnyThread[]
          const map = new Map<string, AnyThread>()
          ;[...filteredRemote, ...list].forEach((t) => { const prev = map.get(t.id); if (!prev || t.updatedAt > prev.updatedAt) map.set(t.id, t) })
          list = Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt)
          localStorage.setItem(storageKey(uid), JSON.stringify(list))
        }
        setThreads(list)
      } catch { setThreads([]) }
    }
    load()
  }, [uid])

  const displayed = useMemo(() => {
    const base = filter === 'all' ? threads : threads.filter(t => t.agent === filter)
    const q = queryText.trim().toLowerCase()
    return q ? base.filter(t => (t.title||'').toLowerCase().includes(q)) : base
  }, [threads, filter, queryText])

  const rename = async (t: AnyThread) => {
    const title = prompt('スレッド名を変更', t.title)
    if (title == null) return
    try {
      const key = storageKey(uid)
      const local = JSON.parse(localStorage.getItem(key) || '[]') as AnyThread[]
      const next = local.map(x => x.id === t.id ? { ...x, title } : x)
      localStorage.setItem(key, JSON.stringify(next))
      if (uid) {
        await setDoc(doc(db, 'users', uid, 'eduAI_threads', t.id), { title, updatedAt: serverTimestamp() }, { merge: true })
      }
      setThreads(prev => prev.map(x => x.id === t.id ? { ...x, title } : x))
    } catch {}
  }

  const remove = async (t: AnyThread) => {
    if (!confirm('このスレッドを削除（アーカイブ）しますか？')) return
    try {
      const key = storageKey(uid)
      const local = JSON.parse(localStorage.getItem(key) || '[]') as AnyThread[]
      const next = local.filter(x => x.id !== t.id)
      localStorage.setItem(key, JSON.stringify(next))
      if (uid) {
        await setDoc(doc(db, 'users', uid, 'eduAI_threads', t.id), { archived: true, deletedAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
      }
      setThreads(prev => prev.filter(x => x.id !== t.id))
    } catch {}
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* ツールバー（モバイルは縦並び） */}
      <div className="mb-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* 左: フィルターチップ（横スクロール） */}
        <div className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center gap-2 px-1">
            {(['all','tutor','planner','counselor'] as const).map(k => (
              <button key={k}
                onClick={() => setFilter(k)}
                className={`rounded-md border px-3 py-1.5 text-xs ${filter===k ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >{k==='all'?'すべて': k==='tutor'?'Tutor': k==='planner' ? 'Planner' : 'Counselor'}</button>
            ))}
          </div>
        </div>
        {/* 右: 検索と新規チャット開始 */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <input
            value={queryText}
            onChange={e=>setQueryText(e.target.value)}
            placeholder="スレッドを検索"
            className="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {showCreateButton && (
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >新規チャット開始</button>
          )}
        </div>
      </div>
      {displayed.length === 0 && (
        <div className="rounded-md border bg-white p-6 text-center text-sm text-gray-600">スレッドがありません。右上のボタンから作成できます。</div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((t) => (
          <div key={t.id} className="rounded-lg border bg-white p-3 shadow-sm transition hover:shadow">
            <div className="mb-2 flex items-center justify-between">
              <span className={`rounded px-2 py-0.5 text-[10px] ${t.agent==='tutor'?'bg-emerald-50 text-emerald-700': t.agent==='planner'?'bg-blue-50 text-blue-700':'bg-purple-50 text-purple-700'}`}>{t.agent}</span>
              <div className="text-xs text-gray-500">{new Date(t.updatedAt).toLocaleString()}</div>
            </div>
            <button onClick={() => onOpen(t.agent, t.id)} className="block w-full text-left">
              <div className="truncate text-sm font-semibold text-gray-900">{t.title || `${t.agent} スレッド`}</div>
              {t.lastMessage && (
                <div className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {t.lastMessage}
                </div>
              )}
            </button>
            <div className="mt-2 flex items-center justify-end gap-2 text-xs">
              <button onClick={()=>rename(t)} className="rounded border px-2 py-1 text-gray-700 hover:bg-gray-50">名前変更</button>
              <button onClick={()=>remove(t)} className="rounded border px-2 py-1 text-red-600 hover:bg-red-50 border-red-200">削除</button>
            </div>
          </div>
        ))}
      </div>

      {/* 新規作成モーダル */}
      {showCreateButton && createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCreateOpen(false)} />
          <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl mx-3">
            <h3 className="mb-2 text-base font-semibold text-gray-900">新規チャットを開始</h3>
            <p className="mb-3 text-sm text-gray-600">種類を選択してください</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([
                { key: 'tutor', label: 'Tutor', color: 'bg-emerald-600', agent: 'tutor' as AgentKind, disabled: false },
                { key: 'planner', label: 'Planner', color: 'bg-blue-600', agent: 'planner' as AgentKind, disabled: false },
                { key: 'counselor', label: 'Counselor', color: 'bg-purple-600', agent: 'counselor' as AgentKind, disabled: true },
              ]).map(item => (
                <div key={item.key} className="relative">
                  <button
                    onClick={async () => {
                      if (item.disabled) return
                      await onCreate(item.agent)
                      setCreateOpen(false)
                    }}
                    disabled={item.disabled}
                    className={`${item.disabled ? 'bg-gray-400 cursor-not-allowed' : item.color} w-full rounded-md px-3 py-3 text-sm font-medium text-white hover:opacity-90 disabled:hover:opacity-100 relative`}
                  >
                    {item.label}
                    {item.disabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                        <span className="text-xs bg-white/90 text-gray-700 px-2 py-1 rounded">開発中</span>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={() => setCreateOpen(false)} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
