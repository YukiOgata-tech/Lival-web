'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, getDocs, limit, orderBy, query, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { MessageSquare, Search, Plus, Edit3, Trash2, Sparkles, BookOpen, Calendar, X } from 'lucide-react'

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
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      {/* ツールバー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* 左: フィルターチップ */}
        <div className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center gap-2 px-1">
            {(['all','tutor','planner','counselor'] as const).map((k, idx) => (
              <motion.button
                key={k}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(k)}
                className={`rounded-xl border px-4 py-2 text-xs font-medium transition-all shadow-sm ${
                  filter===k
                    ? 'border-emerald-600 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {k==='all'?'すべて': k==='tutor'?'Tutor': k==='planner' ? 'Planner' : 'Counselor'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 右: 検索と新規チャット */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={queryText}
              onChange={e=>setQueryText(e.target.value)}
              placeholder="スレッドを検索..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          {showCreateButton && (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              新規チャット開始
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 空状態 */}
      {displayed.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl border-2 border-dashed border-gray-300"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageSquare className="mx-auto h-16 w-16 text-gray-400" />
          </motion.div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">スレッドがありません</h3>
          <p className="mt-2 text-sm text-gray-500">右上のボタンから新しいチャットを開始できます</p>
        </motion.div>
      )}

      {/* スレッドグリッド */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {displayed.map((t, index) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ delay: index * 0.05, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative rounded-2xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              {/* 背景グラデーション */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                t.agent==='tutor'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  : t.agent==='planner'
                  ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                  : 'bg-gradient-to-r from-purple-400 to-pink-500'
              }`} />

              <div className="mb-3 flex items-center justify-between">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    t.agent==='tutor'
                      ? 'bg-emerald-50 text-emerald-700'
                      : t.agent==='planner'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}
                >
                  {t.agent === 'tutor' ? <Sparkles className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                  {t.agent}
                </motion.span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(t.updatedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => onOpen(t.agent, t.id)}
                className="block w-full text-left mb-3"
              >
                <div className="truncate text-base font-bold text-gray-900 mb-1">
                  {t.title || `${t.agent} スレッド`}
                </div>
                {t.lastMessage && (
                  <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {t.lastMessage}
                  </div>
                )}
              </motion.button>

              <div className="flex items-center justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={()=>rename(t)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  名前変更
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={()=>remove(t)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  削除
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 新規作成モーダル */}
      <AnimatePresence>
        {showCreateButton && createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setCreateOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  新規チャットを開始
                </h3>
                <p className="mt-1 text-sm text-gray-600">AIの種類を選択してください</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4"
              >
                {([
                  { key: 'tutor', label: 'Tutor', color: 'from-emerald-500 to-emerald-600', agent: 'tutor' as AgentKind, disabled: false, icon: Sparkles },
                  { key: 'planner', label: 'Planner', color: 'from-blue-500 to-blue-600', agent: 'planner' as AgentKind, disabled: false, icon: BookOpen },
                  { key: 'counselor', label: 'Counselor', color: 'from-purple-500 to-purple-600', agent: 'counselor' as AgentKind, disabled: true, icon: MessageSquare },
                ]).map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      className="relative"
                    >
                      <motion.button
                        whileHover={!item.disabled ? { scale: 1.05, y: -4 } : {}}
                        whileTap={!item.disabled ? { scale: 0.95 } : {}}
                        onClick={async () => {
                          if (item.disabled) return
                          await onCreate(item.agent)
                          setCreateOpen(false)
                        }}
                        disabled={item.disabled}
                        className={`${
                          item.disabled
                            ? 'bg-gray-400 cursor-not-allowed'
                            : `bg-gradient-to-r ${item.color}`
                        } w-full rounded-xl px-4 py-4 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all relative flex flex-col items-center gap-2`}
                      >
                        <Icon className="w-6 h-6" />
                        {item.label}
                        {item.disabled && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl backdrop-blur-[2px]">
                            <span className="text-xs bg-white text-gray-700 px-3 py-1.5 rounded-full font-semibold shadow-md">
                              開発中
                            </span>
                          </div>
                        )}
                      </motion.button>
                    </motion.div>
                  )
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCreateOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <X className="w-4 h-4" />
                  キャンセル
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
