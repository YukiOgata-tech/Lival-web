'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import ThreadsPanel from '@/components/agent/common/ThreadsPanel'
import Image from 'next/image'
import { Sparkles, BookOpen, MessageSquare, X } from 'lucide-react'

export default function ThreadsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user])

  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      {/* 背景装飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* 背景ロゴ */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 1 }}
          className="select-none"
        >
          <Image
            src="/images/header-livalAI.png"
            alt="LIVAL AI"
            width={500}
            height={125}
            className="max-w-md w-auto h-auto"
            priority
          />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ヘッダー */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-2 whitespace-nowrap sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="cursor-pointer"
              >
                <Image src="/images/Lival-text.png" alt="LIVAL AI" width={100} height={24} className="h-5 w-auto sm:h-6 hover:opacity-80 transition-opacity" />
              </motion.button>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 px-3 py-1 text-[10px] font-bold text-blue-700 sm:text-xs">
                <MessageSquare className="w-3 h-3" />
                Threads
              </span>
              <span className="ml-1 truncate text-xs text-gray-600 sm:ml-2 sm:text-sm font-medium">スレッド一覧</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all sm:px-4 sm:py-2 sm:text-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                New Chat
              </motion.button>
            </div>
          </div>
        </motion.div>
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
        {/* 新規作成モーダル */}
        <AnimatePresence>
          {createOpen && (
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
                    { key: 'tutor', label: 'Tutor', color: 'from-emerald-500 to-emerald-600', agent: 'tutor' as const, disabled: false, icon: Sparkles },
                    { key: 'planner', label: 'Planner', color: 'from-blue-500 to-blue-600', agent: 'planner' as const, disabled: false, icon: BookOpen },
                    { key: 'counselor', label: 'Counselor', color: 'from-purple-500 to-purple-600', agent: 'counselor' as const, disabled: true, icon: MessageSquare },
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

                            if (item.agent === 'planner') {
                              router.push(`/lival-agent-mode/threads/planner/${id}`)
                            } else if (item.agent === 'tutor') {
                              router.push(`/lival-agent-mode/threads/tutor/${id}`)
                            } else if (item.agent === 'counselor') {
                              router.push(`/lival-agent-mode/threads/counselor/${id}`)
                            }
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
    </div>
  )
}
