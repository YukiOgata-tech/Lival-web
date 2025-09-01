'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export type AgentKind = 'planner' | 'tutor' | 'counselor'

export type ChatThread = {
  id: string
  title: string
  agent: AgentKind
  createdAt: number
  updatedAt: number
}

function storageKey(uid: string | null) {
  return `lival_chat_threads_${uid ?? 'guest'}`
}

export default function AgentChatSidebar({
  uid,
  open,
  onClose,
  activeThreadId,
  onCreateThread,
  onSelectThread,
}: {
  uid: string | null
  open: boolean
  onClose: () => void
  activeThreadId: string | null
  onCreateThread: (agent: AgentKind) => void
  onSelectThread: (id: string) => void
}) {
  const [threads, setThreads] = useState<ChatThread[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(uid))
      if (raw) setThreads(JSON.parse(raw))
    } catch {}
  }, [uid])

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-80 transform border-r bg-gray-50 transition-transform duration-200 ease-out sm:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-gray-100 px-4 py-3">
        <div className="font-semibold text-gray-900">スレッド</div>
        <button onClick={onClose} className="sm:hidden">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-2 p-3">
        <button
          onClick={() => {
            onCreateThread('planner')
            onClose()
          }}
          className="flex w-full items-center justify-between rounded-md bg-blue-600 px-3 py-2 text-left text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
        >
          新しくチャット（Planner）
          <span className="rounded bg-white/20 px-2 py-0.5 text-xs text-white">新規</span>
        </button>

        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left text-sm text-gray-500"
        >
          新しくチャット（Tutor：開発中）
        </button>
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left text-sm text-gray-500"
        >
          新しくチャット（Counselor：開発中）
        </button>
      </div>

      <div className="mt-2 border-t bg-gray-100 p-3 text-xs font-semibold text-gray-800">履歴</div>
      <AgentThreadsPanel
        uid={uid}
        activeThreadId={activeThreadId}
        onSelectThread={onSelectThread}
      />
    </aside>
  )
}

export function AgentThreadsPanel({
  uid,
  activeThreadId,
  onSelectThread,
}: {
  uid: string | null
  activeThreadId: string | null
  onSelectThread: (id: string) => void
}) {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(uid))
      setThreads(raw ? JSON.parse(raw) : [])
    } catch {
      setThreads([])
    }
  }, [uid])

  const normalized = query.trim().toLowerCase()
  const filtered = normalized
    ? threads.filter((t) => (t.title || '').toLowerCase().includes(normalized))
    : threads

  return (
    <div className="space-y-1 px-3 pb-6">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-white pb-2 pt-2">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="スレッド検索"
            className="w-full rounded-md border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414L12.9 14.32zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd" />
          </svg>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="検索をクリア"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {threads.length === 0 && (
        <div className="px-3 py-8 text-sm text-gray-500">まだチャット履歴がありません</div>
      )}
      {threads.length > 0 && filtered.length === 0 && (
        <div className="px-3 py-6 text-xs text-gray-500">該当するスレッドがありません</div>
      )}

      {filtered.map((t) => (
        <div
          key={t.id}
          className={`group flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-gray-200 ${
            t.id === activeThreadId ? 'bg-gray-300' : ''
          }`}
        >
          <button onClick={() => onSelectThread(t.id)} className="flex-1 text-left">
            <div className="flex items-center gap-2 text-gray-900">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${
                  t.agent === 'planner' ? 'bg-blue-500' : t.agent === 'tutor' ? 'bg-emerald-500' : 'bg-purple-500'
                }`}
              />
              <span className="truncate font-medium">{t.title || '新規スレッド'}</span>
            </div>
            <div className="mt-0.5 truncate text-xs text-gray-700">
              {new Date(t.updatedAt).toLocaleString()}
            </div>
          </button>
          <ThreadActions uid={uid} thread={t} onChanged={() => onSelectThread(t.id)} />
        </div>
      ))}
    </div>
  )
}

function ThreadActions({
  uid,
  thread,
  onChanged,
}: {
  uid: string | null
  thread: ChatThread
  onChanged: () => void
}) {
  const rename = async () => {
    const title = prompt('スレッド名を変更', thread.title)
    if (title == null) return
    try {
      const key = storageKey(uid)
      const list = JSON.parse(localStorage.getItem(key) || '[]') as ChatThread[]
      const next = list.map((t) => (t.id === thread.id ? { ...t, title } : t))
      localStorage.setItem(key, JSON.stringify(next))
      if (uid) {
        const ref = doc(db, 'users', uid, 'eduAI_threads', thread.id)
        await setDoc(ref, { title }, { merge: true })
      }
      onChanged()
    } catch {}
  }
  const remove = async () => {
    if (!confirm('このスレッドを削除しますか？（履歴は端末から削除されます）')) return
    try {
      const key = storageKey(uid)
      const list = JSON.parse(localStorage.getItem(key) || '[]') as ChatThread[]
      const next = list.filter((t) => t.id !== thread.id)
      localStorage.setItem(key, JSON.stringify(next))
      // remove messages cache
      const msgKey = `lival_chat_messages_${uid ?? 'guest'}_${thread.id}`
      localStorage.removeItem(msgKey)
      if (uid) {
        const ref = doc(db, 'users', uid, 'eduAI_threads', thread.id)
        await setDoc(ref, { archived: true, deletedAt: serverTimestamp() }, { merge: true })
      }
      onChanged()
    } catch {}
  }
  return (
    <div className="ml-2 hidden items-center gap-1 sm:flex">
      <button onClick={rename} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="名前を変更">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 010 2.828l-1.793 1.793-4.414-4.414 1.793-1.793a2 2 0 012.828 0l1.586 1.586zM2 13.586l9-9 4.414 4.414-9 9H2v-4.414z"/></svg>
      </button>
      <button onClick={remove} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" title="削除">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 7a1 1 0 011 1v7a1 1 0 11-2 0V8a1 1 0 011-1zm4 0a1 1 0 011 1v7a1 1 0 11-2 0V8a1 1 0 011-1zm4 0a1 1 0 011 1v7a1 1 0 11-2 0V8a1 1 0 011-1zM4 5a1 1 0 011-1h10a1 1 0 011 1v1H4V5zm3-2a1 1 0 011-1h4a1 1 0 011 1v1H7V3z" clipRule="evenodd"/></svg>
      </button>
    </div>
  )
}
