'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import ThreadsPanel from '@/components/agent/common/ThreadsPanel'
import Image from 'next/image'
import { useState } from 'react'

export default function ThreadsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user])

  return (
    <div className="relative min-h-[100dvh] bg-gray-50">
      {/* 背景ロゴ */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="opacity-[0.8] select-none">
          <Image 
            src="/images/header-livalAI.png" 
            alt="LIVAL AI" 
            width={400}
            height={100}
            className="max-w-sm w-auto h-auto"
            priority
          />
        </div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ヘッダー（Plannerヘッダー寄せ） */}
        <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
            <div className="flex min-w-0 items-center gap-2 whitespace-nowrap sm:gap-3">
              <button onClick={() => router.push('/')} className="cursor-pointer">
                <Image src="/images/Lival-text.png" alt="LIVAL AI" width={100} height={24} className="h-5 w-auto sm:h-6 hover:opacity-80 transition-opacity" />
              </button>
              <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 sm:text-xs">Threads</span>
              <span className="ml-1 truncate text-xs text-gray-600 sm:ml-2 sm:text-sm">スレッド一覧</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCreateOpen(true)} className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700">New Chat</button>
            </div>
          </div>
        </div>
        <ThreadsPanel
          uid={user?.uid ?? null}
          initialFilter={'all'}
          showCreateButton={false}
          onCreate={async (agent) => {
            // カウンセラーは開発中なので作成不可
            if (agent === 'counselor') {
              alert('Counselorは現在開発中です。しばらくお待ちください。')
              return
            }
            
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
              const local = JSON.parse(localStorage.getItem(key) || '[]') as Array<{ id: string; title: string; agent: string; updatedAt: number; lastMessage?: string }>
              const now = Date.now()
              const next = [{ id, title: `${agent} スレッド`, agent, updatedAt: now, lastMessage: '' }, ...local]
              localStorage.setItem(key, JSON.stringify(next))
              localStorage.setItem('lival_desired_thread', id)
            } catch {}
            
            // チャット作成後の遷移
            if (agent === 'planner') {
              router.push(`/lival-agent-mode/threads/planner/${id}`)
            } else if (agent === 'tutor') {
              router.push(`/lival-agent-mode/threads/tutor/${id}`)
            }
          }}
          onOpen={(agent, id) => {
            // カウンセラーは開発中なので開けない
            if (agent === 'counselor') {
              alert('Counselorは現在開発中です。しばらくお待ちください。')
              return
            }
            
            try { localStorage.setItem('lival_desired_thread', id) } catch {}
            if (agent === 'planner') {
              router.push(`/lival-agent-mode/threads/planner/${id}`)
            } else if (agent === 'tutor') {
              router.push(`/lival-agent-mode/threads/tutor/${id}`)
            }
          }}
        />
        {/* 新規作成モーダル（ヘッダーのボタンから） */}
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setCreateOpen(false)} />
            <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl mx-3">
              <h3 className="mb-2 text-base font-semibold text-gray-900">新規チャットを開始</h3>
              <p className="mb-3 text-sm text-gray-600">種類を選択してください</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  { key: 'tutor', label: 'Tutor', color: 'bg-emerald-600', agent: 'tutor' as const, disabled: false },
                  { key: 'planner', label: 'Planner', color: 'bg-blue-600', agent: 'planner' as const, disabled: false },
                  { key: 'counselor', label: 'Counselor', color: 'bg-purple-600', agent: 'counselor' as const, disabled: true },
                ]).map(item => (
                  <div key={item.key} className="relative">
                    <button
                      onClick={async () => {
                        if (item.disabled) return
                        setCreateOpen(false)
                        
                        if (!user) return
                        const id = crypto.randomUUID()
                        const { db } = await import('@/lib/firebase')
                        const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
                        await setDoc(doc(db, 'users', user.uid, 'eduAI_threads', id), {
                          id,
                          title: `${item.agent} スレッド`,
                          agent: item.agent,
                          archived: false,
                          createdAt: serverTimestamp(),
                          updatedAt: serverTimestamp(),
                        }, { merge: true })
                        
                        try {
                          const key = `lival_chat_threads_${user.uid}`
                          const local = JSON.parse(localStorage.getItem(key) || '[]') as Array<{ id: string; title: string; agent: string; updatedAt: number; lastMessage?: string }>
                          const now = Date.now()
                          const next = [{ id, title: `${item.agent} スレッド`, agent: item.agent, updatedAt: now, lastMessage: '' }, ...local]
                          localStorage.setItem(key, JSON.stringify(next))
                          localStorage.setItem('lival_desired_thread', id)
                        } catch {}
                        
                        // チャット作成後の遷移
                        if (item.agent === 'planner') {
                          router.push(`/lival-agent-mode/threads/planner/${id}`)
                        } else if (item.agent === 'tutor') {
                          router.push(`/lival-agent-mode/threads/tutor/${id}`)
                        } else if (item.agent === 'counselor') {
                          router.push(`/lival-agent-mode/threads/counselor/${id}`)
                        }
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
    </div>
  )
}
