'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import ThreadsPanel from '@/components/agent/common/ThreadsPanel'
import Image from 'next/image'
import { useState } from 'react'

export default function AgentThreadsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams<{ agent: string }>()
  const agentParam = (params?.agent as string) || 'all'
  const initialFilter = (['planner','tutor','counselor'].includes(agentParam) ? agentParam : 'all') as 'all' | 'planner' | 'tutor' | 'counselor'
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user])

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
            <div className="flex min-w-0 items-center gap-2 whitespace-nowrap sm:gap-3">
              <Image src="/images/Lival-text.png" alt="LIVAL AI" width={100} height={24} className="h-5 w-auto sm:h-6" />
              <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 sm:text-xs">Threads</span>
              <span className="ml-1 truncate text-xs text-gray-600 sm:ml-2 sm:text-sm">{initialFilter==='all'?'すべて':initialFilter} のスレッド一覧</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCreateOpen(true)} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">new chat</button>
            </div>
          </div>
        </div>
        <ThreadsPanel
          uid={user?.uid ?? null}
          initialFilter={initialFilter}
          showCreateButton={false}
          onCreate={async (agent) => {
            if (!user) return
            const id = crypto.randomUUID()
            const { db } = await import('@/lib/firebase')
            const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
            await setDoc(doc(db, 'users', user.uid, 'eduAI_threads', id), {
              id,
              title: `${agent} スレッド`,
              agent,
              archived: false,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }, { merge: true })
            try {
              const key = `lival_chat_threads_${user.uid}`
              const local = JSON.parse(localStorage.getItem(key) || '[]') as Array<{ id: string; title: string; agent: string; updatedAt: number }>
              const now = Date.now()
              const next = [{ id, title: `${agent} スレッド`, agent, updatedAt: now }, ...local]
              localStorage.setItem(key, JSON.stringify(next))
              localStorage.setItem('lival_desired_thread', id)
            } catch {}
            if (agent === 'planner') router.push(`/lival-agent-mode/threads/planner/${id}`)
            else if (agent === 'tutor') router.push(`/lival-agent-mode/threads/tutor/${id}`)
            else router.push(`/lival-agent-mode/threads/counselor/${id}`)
          }}
          onOpen={(agent, id) => {
            try { localStorage.setItem('lival_desired_thread', id) } catch {}
            if (agent === 'planner') router.push(`/lival-agent-mode/threads/planner/${id}`)
            else if (agent === 'tutor') router.push(`/lival-agent-mode/threads/tutor/${id}`)
            else router.push(`/lival-agent-mode/threads/counselor/${id}`)
          }}
        />
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setCreateOpen(false)} />
            <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl mx-3">
              <h3 className="mb-2 text-base font-semibold text-gray-900">新規チャット</h3>
              <p className="mb-3 text-sm text-gray-600">AIを選択してください</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  { key: 'tutor', label: 'Tutor', color: 'bg-emerald-600', agent: 'tutor' as const },
                  { key: 'planner', label: 'Planner', color: 'bg-blue-600', agent: 'planner' as const },
                  { key: 'counselor', label: 'Counselor', color: 'bg-purple-600', agent: 'counselor' as const },
                ]).map(item => (
                  <button key={item.key}
                    onClick={async () => { await (async (a)=>{
                      if (!user) return
                      const id = crypto.randomUUID()
                      const { db } = await import('@/lib/firebase')
                      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
                      await setDoc(doc(db, 'users', user.uid, 'eduAI_threads', id), {
                        id,
                        title: `${a} スレッド`,
                        agent: a,
                        archived: false,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                      }, { merge: true })
                      try {
                        const key = `lival_chat_threads_${user.uid}`
                        const local = JSON.parse(localStorage.getItem(key) || '[]') as Array<{ id: string; title: string; agent: string; updatedAt: number }>
                        const now = Date.now()
                        const next = [{ id, title: `${a} スレッド`, agent: a, updatedAt: now }, ...local]
                        localStorage.setItem(key, JSON.stringify(next))
                      } catch {}
                      if (a === 'planner') router.push(`/lival-agent-mode/threads/planner/${id}`)
                      else if (a === 'tutor') router.push(`/lival-agent-mode/threads/tutor/${id}`)
                      else router.push(`/lival-agent-mode/threads/counselor/${id}`)
                    })(item.agent); setCreateOpen(false) }}
                    className={`${item.color} rounded-md px-3 py-3 text-sm font-medium text-white hover:opacity-90`}
                  >{item.label}</button>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => setCreateOpen(false)} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">キャンセル</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
