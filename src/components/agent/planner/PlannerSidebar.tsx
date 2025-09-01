'use client'

import { useEffect, useState } from 'react'

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

export default function PlannerSidebar({
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

  const persist = (next: ChatThread[]) => {
    setThreads(next)
    try {
      localStorage.setItem(storageKey(uid), JSON.stringify(next))
    } catch {}
  }

  const createPlanner = () => {
    onCreateThread('planner')
    onClose()
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-80 transform border-r bg-white transition-transform duration-200 ease-out sm:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="font-semibold">スレッド</div>
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
          onClick={createPlanner}
          className="flex w-full items-center justify-between rounded-md border bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          新しくチャットを開始（Planner）
          <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">新規</span>
        </button>

        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-between rounded-md border bg-gray-50 px-3 py-2 text-left text-sm text-gray-400"
        >
          新しくチャット（Tutor：開発中）
        </button>
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-between rounded-md border bg-gray-50 px-3 py-2 text-left text-sm text-gray-400"
        >
          新しくチャット（Counselor：開発中）
        </button>
      </div>

      <div className="mt-2 border-t p-3 text-xs text-gray-500">履歴</div>
      <div className="space-y-1 px-3 pb-6">
        {threads.length === 0 && (
          <div className="px-3 py-8 text-sm text-gray-500">まだチャット履歴がありません</div>
        )}
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectThread(t.id)}
            className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50 ${
              t.id === activeThreadId ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
              <span className="truncate font-medium text-black">{t.title || '新規スレッド'}</span>
            </div>
            <div className="mt-0.5 truncate text-xs text-gray-500">
              {new Date(t.updatedAt).toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

