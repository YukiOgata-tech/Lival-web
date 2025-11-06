'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import PlannerInputBar, { type Mode } from '@/components/agent/planner/PlannerInputBar'
import PlannerChatMessage, { type ChatMessage } from '@/components/agent/planner/PlannerChatMessage'
import PlanDetailModal from '@/components/agent/planner/PlanDetailModal'
import LottieLoader from '@/components/agent/common/LottieLoader'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/lib/firebase'
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

type UiHints = { cta?: 'ask'|'plan'; asks?: string[]; missing?: string[]; ready?: boolean; quickPicks?: { horizon?: string[]; priorities?: string[] } }

function messagesKey(uid: string | null, threadId: string) { return `lival_chat_messages_${uid ?? 'guest'}_${threadId}` }

export default function PlannerThreadPage() {
  const { user, loading } = useAuth()
  const params = useParams<{ threadId: string }>()
  const threadId = params?.threadId
  const [mode, setMode] = useState<Mode>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [uiHints, setUiHints] = useState<UiHints | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any | null>(null)
  const [suggestNewThread, setSuggestNewThread] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // メッセージ初期化
  useEffect(() => {
    if (loading || !threadId) return
    const seed = async () => {
      const raw = localStorage.getItem(messagesKey(user?.uid ?? null, threadId))
      let list: ChatMessage[] = raw ? JSON.parse(raw).map((m: any) => { const { animate, ...rest } = m; return rest }) : []
      if (user) {
        const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
        // 存在しない場合は最小作成（一覧から直接来ていないケース対策）
        await setDoc(threadRef, { id: threadId, title: 'Planner スレッド', agent: 'planner', archived: false, updatedAt: serverTimestamp() }, { merge: true })
        const col = collection(threadRef, 'messages')
        const q = query(col, orderBy('createdAt', 'asc'), limit(50))
        const snap = await getDocs(q)
        let lastPlanText: string | null = null
        const remote = snap.docs.map(d => {
          const data = d.data() as any
          const kind = data.kind as string | undefined
          let content: string = data.content
          if (kind === 'plan_text') lastPlanText = String(data.content || '')
          if (kind === 'plan_json') {
            try {
              const payload = encodeURIComponent(JSON.stringify({ text: lastPlanText || '', plan: data.plan, versionLabel: data.versionLabel }))
              content = `__PLAN_CARD__:${payload}`
            } catch { content = data.content }
          }
          return { id: d.id, role: data.role, content, createdAt: data.createdAt?.toMillis?.() || Date.now() } as ChatMessage
        })
        if (list.length === 0 && remote.length > 0) list = remote
      }
      setSuggestNewThread(list.some(m => m.content.startsWith('__PLAN_CARD__')))
      setMessages(list)
    }
    seed()
  }, [loading, user?.uid, threadId])

  const persistMessages = (threadId: string, next: ChatMessage[]) => {
    setMessages(next)
    const sanitized = next.map(({ animate, ...rest }) => rest)
    localStorage.setItem(messagesKey(user?.uid ?? null, threadId), JSON.stringify(sanitized))
  }

  const appendMessage = (msg: ChatMessage, kindOverride?: 'ask'|'chitchat'|'plan_text'|'plan_json', saveRemote = true) => {
    if (!threadId) return
    const raw = localStorage.getItem(messagesKey(user?.uid ?? null, threadId))
    const base: ChatMessage[] = raw ? JSON.parse(raw) : []
    const next = [...base, msg]
    persistMessages(threadId, next)
    if (user && saveRemote) {
      const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
      const col = collection(threadRef, 'messages')
      addDoc(col, { role: msg.role, agent: 'planner', content: msg.content, kind: kindOverride || (msg.role === 'user' ? 'ask' : (msg.content.startsWith('__PLAN_CARD__') ? 'plan_json' : 'chitchat')), createdAt: serverTimestamp() })
      updateDoc(threadRef, { updatedAt: serverTimestamp() })
    }
  }

  const recentMessagesForFn = () => messages.filter(m => !m.content.startsWith('__PLAN_CARD__')).slice(-8).map(m => ({ role: m.role, content: m.content }))

  const callPlannerChat = async (text: string) => {
    if (!user || !threadId) return
    setBusy(true)
    appendMessage({ id: crypto.randomUUID(), role: 'user', content: text, createdAt: Date.now() }, 'ask')
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
    try {
      const fn = httpsCallable(functions, 'plannerChat')
      const res = await fn({ uid: user.uid, threadId, lastUserText: text, recentMessages: recentMessagesForFn() })
      const data = res.data as { text: string; uiHints?: UiHints }
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: data.text, createdAt: Date.now(), animate: true }, 'chitchat')
      setUiHints(data.uiHints || null)
    } catch (e) {
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: 'エラーが発生しました。時間を置いて再試行してください。', createdAt: Date.now() })
    } finally { setBusy(false) }
  }

  const callPlannerGenerate = async (session: { horizonText?: string; priorities?: string[]; goalText?: string; dailyCapMin?: number }) => {
    if (!user || !threadId) return
    setBusy(true)
    try {
      const fn = httpsCallable(functions, 'plannerGenerate')
      const res = await fn({ uid: user.uid, threadId, session, recentMessages: recentMessagesForFn() })
      const data = res.data as { text: string; plan?: any; sessionEcho?: any; versionLabel?: string }
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: data.text, createdAt: Date.now(), animate: true }, 'plan_text', false)
      const payload = encodeURIComponent(JSON.stringify({ text: data.text, plan: data.plan, versionLabel: data.versionLabel }))
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: `__PLAN_CARD__:${payload}`, createdAt: Date.now() }, 'plan_json', false)
      const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
      await setDoc(threadRef, { id: threadId, title: 'Planner スレッド', agent: 'planner', updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge: true })
    } catch (e) {
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: 'プランの作成に失敗しました。再試行してください。', createdAt: Date.now() })
    } finally { setBusy(false) }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages.length, busy])

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border bg-white p-6 text-center">
          <h2 className="mb-2 text-xl font-bold">ログインが必要です</h2>
          <p className="mb-6 text-gray-600">Planner AI を利用するにはログインまたは新規登録してください。</p>
          <div className="flex justify-center gap-3">
            <a href="/login" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">ログイン</a>
            <a href="/signup" className="rounded-md border px-4 py-2 hover:bg-gray-50">新規登録</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto min-h-[100dvh] max-w-7xl bg-gradient-to-b from-blue-50/30 via-white to-indigo-50/20">
      {/* 背景装飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* 背景ロゴ */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1 }}
          className="select-none"
        >
          <Image
            src="/images/header-livalAI.png"
            alt="LIVAL AI"
            width={400}
            height={100}
            className="max-w-sm w-auto h-auto"
            priority
          />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl space-y-4 p-4 pb-32 sm:pb-40">
        {messages.map((m) => (
          <div key={m.id}>
            <PlannerChatMessage
              msg={m}
              onPlanAction={(action, payload) => {
                if (action === 'detail' || action === 'pdf') {
                  setModalData(payload)
                  setModalOpen(true)
                }
                if (action === 'regenerate') {
                  setMode('generate')
                  callPlannerGenerate(payload?.sessionEcho || {})
                }
              }}
            />
          </div>
        ))}
        {busy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex-shrink-0 mt-1"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[85%] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">
                  回答を作成中…
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-20" />
      </div>
      <PlannerInputBar mode={mode} setMode={setMode} disabled={busy} onChat={callPlannerChat} onGenerate={callPlannerGenerate} />
      {modalOpen && (<PlanDetailModal open={modalOpen} onClose={() => setModalOpen(false)} data={modalData} />)}
    </div>
  )
}
