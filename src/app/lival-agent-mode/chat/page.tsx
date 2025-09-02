'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import AgentChatSidebar, { type AgentKind, type ChatThread, AgentThreadsPanel } from '@/components/agent/common/AgentChatSidebar'
import { Sparkles } from 'lucide-react'
import { List, MessageSquare } from 'lucide-react'
import PlannerInputBar, { type Mode } from '@/components/agent/planner/PlannerInputBar'
import PlannerChatMessage, { type ChatMessage } from '@/components/agent/planner/PlannerChatMessage'
import PlanDetailModal from '@/components/agent/planner/PlanDetailModal'
import LottieLoader from '@/components/agent/common/LottieLoader'
import { useAuth } from '@/hooks/useAuth'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, doc, setDoc, orderBy, query, limit, getDocs, updateDoc } from 'firebase/firestore'

type UiHints = {
  cta?: 'ask' | 'plan'
  asks?: string[]
  missing?: string[]
  ready?: boolean
  quickPicks?: { horizon?: string[]; priorities?: string[] }
}

function threadsKey(uid: string | null) {
  return `lival_chat_threads_${uid ?? 'guest'}`
}
function messagesKey(uid: string | null, threadId: string) {
  return `lival_chat_messages_${uid ?? 'guest'}_${threadId}`
}

export default function PlannerChatPage() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileView, setMobileView] = useState<'chat' | 'threads'>('chat')
  const [mode, setMode] = useState<Mode>('chat')
  const [agent, setAgent] = useState<AgentKind>('planner')
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [uiHints, setUiHints] = useState<UiHints | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [suggestNewThread, setSuggestNewThread] = useState(false)

  // 初回ロード: スレッド読み込み
  useEffect(() => {
    if (loading) return
    const init = async () => {
      const listRaw = localStorage.getItem(threadsKey(user?.uid ?? null))
      let list: ChatThread[] = listRaw ? JSON.parse(listRaw) : []
      // Firestore からも取得し、ローカルとマージ
      if (user) {
        const threadsRef = collection(db, 'users', user.uid, 'eduAI_threads')
        const q = query(threadsRef, orderBy('updatedAt', 'desc'), limit(30))
        const snap = await getDocs(q)
        const remote = snap.docs
          .map((d) => {
            const data = d.data() as any
            if (data.archived === true) return null
            return {
              id: d.id,
              title: data.title || 'Planner スレッド',
              agent: (data.agent as AgentKind) || 'planner',
              createdAt: data.createdAt?.toMillis?.() || Date.now(),
              updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
            } as ChatThread
          })
          .filter(Boolean) as ChatThread[]
        // merge by id, prefer newer updatedAt
        const mergedMap = new Map<string, ChatThread>()
        ;[...remote, ...list].forEach((t) => {
          const prev = mergedMap.get(t.id)
          if (!prev || t.updatedAt > prev.updatedAt) mergedMap.set(t.id, t)
        })
        list = Array.from(mergedMap.values()).sort((a, b) => b.updatedAt - a.updatedAt)
        localStorage.setItem(threadsKey(user.uid), JSON.stringify(list))
      }
      setThreads(list)
      if (list.length > 0) setActiveThreadId(list[0].id)
    }
    init()
  }, [loading, user?.uid])

  // アクティブスレッド変更でメッセージ読み込み
  useEffect(() => {
    if (!activeThreadId) return setMessages([])
    const seed = async () => {
      const raw = localStorage.getItem(messagesKey(user?.uid ?? null, activeThreadId))
      let list: ChatMessage[] = raw ? JSON.parse(raw) : []
      // 既存キャッシュに含まれるアニメーションフラグは無効化（再描画時のタイピング防止）
      list = list.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt }))
      // Firestoreから復元（最新50）
      if (user) {
        const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', activeThreadId)
        const col = collection(threadRef, 'messages')
        const q = query(col, orderBy('createdAt', 'asc'), limit(50))
        const snap = await getDocs(q)
        let lastPlanText: string | null = null
        let hasPlan = false
        const remote = snap.docs.map((d) => {
          const data = d.data() as any
          const kind = data.kind as string | undefined
          let content: string = data.content
          if (kind === 'plan_text') {
            lastPlanText = String(data.content || '')
          }
          if (kind === 'plan_json') {
            hasPlan = true
            try {
              const payload = encodeURIComponent(
                JSON.stringify({ text: lastPlanText || '', plan: data.plan, versionLabel: data.versionLabel })
              )
              content = `__PLAN_CARD__:${payload}`
            } catch {
              content = data.content
            }
          }
          return {
            id: d.id,
            role: data.role,
            content,
            createdAt: data.createdAt?.toMillis?.() || Date.now(),
          } as ChatMessage
        })
        // if local is empty, use remote
        if (list.length === 0 && remote.length > 0) {
          list = remote
          localStorage.setItem(messagesKey(user.uid, activeThreadId), JSON.stringify(list))
        }
      }
      // プランが存在するスレッドでは別スレッド作成の提案を表示
      setSuggestNewThread(list.some((m) => m.content.startsWith('__PLAN_CARD__')))

      if (list.length === 0) {
        // 直前にローカルへ保存された場合の競合に備え、短い遅延後に再読込
        setTimeout(() => {
          const retryRaw = localStorage.getItem(messagesKey(user?.uid ?? null, activeThreadId))
          const retry = retryRaw ? JSON.parse(retryRaw) : []
          const retryClean = retry.map((m: any) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt }))
          setMessages(retryClean.length > 0 ? retryClean : list)
          setSuggestNewThread((retryClean.length > 0 ? retryClean : list).some((m: any) => String(m.content).startsWith('__PLAN_CARD__')))
        }, 50)
      } else {
        setMessages(list)
      }
    }
    seed()
  }, [activeThreadId, user?.uid])

  const persistThreads = (next: ChatThread[]) => {
    setThreads(next)
    localStorage.setItem(threadsKey(user?.uid ?? null), JSON.stringify(next))
  }
  const persistMessages = (threadId: string, next: ChatMessage[]) => {
    setMessages(next)
    localStorage.setItem(messagesKey(user?.uid ?? null, threadId), JSON.stringify(next))
  }

  const createThread = (kind: AgentKind): string => {
    const id = crypto.randomUUID()
    const now = Date.now()
    const t: ChatThread = {
      id,
      title: kind === 'planner' ? 'Planner スレッド' : '新規スレッド',
      agent: kind,
      createdAt: now,
      updatedAt: now,
    }
    const next = [t, ...threads]
    persistThreads(next)
    setActiveThreadId(id)
    persistMessages(id, [])
    // Firestoreにも作成
    if (user) {
      const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', id)
      setDoc(threadRef, {
        id,
        title: t.title,
        agent: kind,
        archived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })
    }
    return id
  }

  const appendMessage = (
    msg: ChatMessage,
    kindOverride?: 'ask' | 'chitchat' | 'plan_text' | 'plan_json',
    targetThreadId?: string,
    saveRemote: boolean = true
  ) => {
    const tId = targetThreadId || activeThreadId
    if (!tId) return
    // ベースは対象スレッドのローカル保存から取得（現在のmessagesは別スレッドの場合がある）
    const raw = localStorage.getItem(messagesKey(user?.uid ?? null, tId))
    const base: ChatMessage[] = raw ? JSON.parse(raw) : []
    const next = [...base, msg]
    localStorage.setItem(messagesKey(user?.uid ?? null, tId), JSON.stringify(next))
    // 表示中のスレッドなら state も更新
    if (tId === activeThreadId) setMessages(next)
    // update thread timestamp
    const nextThreads = threads.map((t) => (t.id === tId ? { ...t, updatedAt: Date.now() } : t))
    persistThreads(nextThreads)
    // Firestoreへ保存
    if (user && saveRemote) {
      const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', tId)
      const messagesCol = collection(threadRef, 'messages')
      addDoc(messagesCol, {
        role: msg.role,
        agent: 'planner',
        content: msg.content,
        kind: kindOverride || (msg.role === 'user' ? 'ask' : (msg.content.startsWith('__PLAN_CARD__') ? 'plan_json' : 'chitchat')),
        createdAt: serverTimestamp(),
      })
      updateDoc(threadRef, { updatedAt: serverTimestamp() })
    }
  }

  const recentMessagesForFn = () => {
    const filtered = messages.filter((m) => !m.content.startsWith('__PLAN_CARD__'))
    return filtered.slice(-8).map((m) => ({ role: m.role, content: m.content }))
  }

  const callPlannerChat = async (text: string) => {
    if (!user) return
    let threadId = activeThreadId
    if (!threadId) threadId = createThread('planner')
    if (!threadId) return
    setBusy(true)
    appendMessage({ id: crypto.randomUUID(), role: 'user', content: text, createdAt: Date.now() }, 'ask', threadId)
    // 入力後にスクロール
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
    try {
      const fn = httpsCallable(functions, 'plannerChat')
      const res = await fn({
        uid: user.uid,
        threadId,
        lastUserText: text,
        recentMessages: recentMessagesForFn(),
      })
      const data = res.data as { text: string; uiHints?: UiHints }
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: data.text, createdAt: Date.now(), animate: true }, 'chitchat', threadId)
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
      setUiHints(data.uiHints || null)
    } catch (e) {
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: 'エラーが発生しました。時間を置いて再試行してください。', createdAt: Date.now() }, 'chitchat', threadId)
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  const callPlannerGenerate = async (session: {
    horizonText?: string
    priorities?: string[]
    goalText?: string
    dailyCapMin?: number
  }) => {
    if (!user) return
    let threadId = activeThreadId
    if (!threadId) threadId = createThread('planner')
    if (!threadId) return
    setBusy(true)
    try {
      const fn = httpsCallable(functions, 'plannerGenerate')
      const res = await fn({ uid: user.uid, threadId, session, recentMessages: recentMessagesForFn() })
      const data = res.data as {
        text: string
        plan?: any
        sessionEcho?: any
        versionLabel?: string
      }
      // 1) 通常テキスト気泡（plan_text）: ローカル表示のみ（Functions側で保存済み）
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: data.text, createdAt: Date.now(), animate: true }, 'plan_text', threadId, false)
      // 2) PlanCard 表示用メッセージ: ローカル表示のみ（Functions側が plan_json を保存）
      const payload = encodeURIComponent(
        JSON.stringify({ text: data.text, plan: data.plan, versionLabel: data.versionLabel })
      )
      const planCardMsg = `__PLAN_CARD__:${payload}`
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: planCardMsg, createdAt: Date.now() }, 'plan_json', threadId, false)
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
      setSuggestNewThread(true)
      // スレッドDoc更新（存在しない場合も含め）
      const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
      await setDoc(threadRef, { id: threadId, title: 'Planner スレッド', agent: 'planner', updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge: true })
    } catch (e) {
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: 'プランの作成に失敗しました。再試行してください。', createdAt: Date.now() })
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  const handlePlanAction = (
    action: 'detail' | 'pdf' | 'regenerate' | 'new-thread',
    payload: any
  ) => {
    if (action === 'detail') {
      setModalData(payload)
      setModalOpen(true)
    }
    if (action === 'pdf') {
      setModalData(payload)
      setModalOpen(true)
    }
    if (action === 'regenerate') {
      const session = payload?.sessionEcho || {}
      // 作成モードで即生成
      setMode('generate')
      callPlannerGenerate(session)
    }
    if (action === 'new-thread') {
      const newId = createThread('planner')
      setActiveThreadId(newId)
      // 次回送信時に生成でも、即時生成でも運用可。ここでは即時生成に対応。
      const session = payload?.sessionEcho || {}
      setMode('generate')
      callPlannerGenerate(session)
    }
  }

  const starterVisible = messages.length === 0
  const quickPicks = uiHints?.quickPicks

  // 新規メッセージやbusy変化時に末尾へスクロール
  useEffect(() => {
    const toBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    toBottom()
  }, [messages.length, busy])

  // 入力フォーカス時、キーボード表示時に追従
  useEffect(() => {
    const onFocus = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    const handler = () => onFocus()
    window.addEventListener('planner-input-focus', handler as EventListener)
    const showThreads = () => setMobileView('threads')
    window.addEventListener('planner-show-threads', showThreads)
    const syncFromHash = () => {
      if (typeof window !== 'undefined') {
        setMobileView(window.location.hash === '#threads' ? 'threads' : 'chat')
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    // visualViewportがあれば、キーボード開閉でスクロール
    const vv: any = (window as any).visualViewport
    const onVv = () => onFocus()
    if (vv?.addEventListener) {
      vv.addEventListener('resize', onVv)
      vv.addEventListener('scroll', onVv)
    } else {
      window.addEventListener('resize', onFocus)
    }
    return () => {
      window.removeEventListener('planner-input-focus', handler as EventListener)
      window.removeEventListener('planner-show-threads', showThreads)
      window.removeEventListener('hashchange', syncFromHash)
      if (vv?.removeEventListener) {
        vv.removeEventListener('resize', onVv)
        vv.removeEventListener('scroll', onVv)
      } else {
        window.removeEventListener('resize', onFocus)
      }
    }
  }, [])

  // 非ログイン時のガード（AuthProvider 側でも対応済みだが、UIで再案内）
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
    <div className="relative mx-auto max-w-7xl min-h-[100dvh]">
      {/* 左サイドバー */}
      {/* デスクトップ固定サイドバー */}
      <div className="hidden sm:block">
        <AgentChatSidebar
          uid={user?.uid ?? null}
          open={true}
          onClose={() => {}}
          activeThreadId={activeThreadId}
          onCreateThread={createThread}
          onSelectThread={(id) => setActiveThreadId(id)}
        />
      </div>

      {/* コンテンツ領域（サイドバー幅を考慮） */}
      <div className="sm:pl-80">
        {/* モバイル: タブバー（スレッド/チャット） */}
        {/* モバイルのスレッド/チャット切替はヘッダーに集約（戻る矢印でスレッド一覧へ） */}

        {/* デスクトップ: タイトル行 */}
        <div className="sticky top-0 z-10 hidden border-b bg-white/70 px-4 py-2 backdrop-blur sm:block">
          <span className="ml-2 text-sm text-gray-500">Planner スレッド</span>
        </div>

        {/* モバイル: スレッドビュー */}
        {mobileView === 'threads' && (
          <div className="mx-auto max-w-3xl p-2 sm:hidden">
            <AgentThreadsPanel
              uid={user?.uid ?? null}
              activeThreadId={activeThreadId}
              onSelectThread={(id) => {
                setActiveThreadId(id)
                setMobileView('chat')
                try { if (typeof window !== 'undefined') window.location.hash = '' } catch {}
              }}
            />
          </div>
        )}

        {/* チャットビュー */}
        <div className={`mx-auto max-w-3xl space-y-3 p-4 pb-32 ${mobileView === 'threads' ? 'hidden sm:block' : ''}`}>
          {/* スターターテンプレート */}
          {starterVisible && (
            <div className="rounded-md border bg-white p-3 text-sm text-gray-700">
              <div className="mb-2 font-medium">スターターテンプレート</div>
              <div className="flex flex-wrap gap-2">
                {['テスト対策でプランを立てたい', '部活と両立できる学習計画', '英語の長文読解を強化したい'].map((tmpl) => (
                  <button
                    key={tmpl}
                    onClick={() => window.dispatchEvent(new CustomEvent('planner-insert-text', { detail: tmpl }))}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* クイックピック（horizon/priorities） */}
          {quickPicks && (
            <div className="rounded-md border bg-white p-3 text-xs text-gray-700">
              <div className="mb-1 font-medium">おすすめ設定</div>
              <div className="flex flex-wrap gap-2">
                {(quickPicks.horizon || []).slice(0, 4).map((h) => (
                  <span key={h} className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{h}</span>
                ))}
                {(quickPicks.priorities || []).slice(0, 4).map((p) => (
                  <span key={p} className="rounded-full bg-gray-100 px-3 py-1">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* メッセージ */}
          {messages.map((m) => (
            <PlannerChatMessage key={m.id} msg={m} onPlanAction={handlePlanAction} />
          ))}

          {/* 最下部参照（スクロール用） */}
          <div ref={bottomRef} />

          {/* 応答待機中のローディング（Lottie） */}
          {busy && (
            <div className="my-3 flex justify-start">
              <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3 shadow-sm">
                <LottieLoader size={56} />
                <span className="text-sm font-medium text-gray-600">AI が考えています…</span>
              </div>
            </div>
          )}
        </div>

        <PlanDetailModal open={modalOpen} onClose={() => setModalOpen(false)} data={modalData} />

        {/* 最下部固定インプットバー（モバイル対応: セーフエリア考慮） */}
        {suggestNewThread && (
          <div className={`fixed inset-x-0 bottom-[74px] z-40 sm:left-80 ${mobileView === 'threads' ? 'hidden sm:block' : ''}`}>
            <div className="mx-auto max-w-3xl px-4">
              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/90 px-3 py-2 shadow-sm backdrop-blur">
                <div className="inline-flex items-center gap-2 text-sm text-blue-800">
                  <Sparkles className="h-4 w-4" />
                  <span>新しいプランは別スレッドで作成しましょう</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSuggestNewThread(false)}
                    className="rounded px-2 py-1 text-xs text-blue-700 hover:bg-blue-100"
                  >
                    非表示
                  </button>
                  <button
                    onClick={() => {
                      const newId = createThread('planner')
                      setActiveThreadId(newId)
                      setSuggestNewThread(false)
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('planner-open-generate'))
                      }
                    }}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    新規スレッドで作成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`fixed inset-x-0 bottom-0 z-30 bg-white sm:left-80 ${mobileView === 'threads' ? 'hidden sm:block' : ''}`}>
          <div className="pb-[env(safe-area-inset-bottom)]">
            <PlannerInputBar
              mode={mode}
              setMode={setMode}
              disabled={busy}
              onChat={callPlannerChat}
              onGenerate={callPlannerGenerate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
