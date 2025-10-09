'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import TutorInputBar from '@/components/agent/tutor/TutorInputBar'
import TutorChatMessageView, { type TutorChatMessage, type TutorTag } from '@/components/agent/tutor/TutorChatMessage'
import LottieLoader from '@/components/agent/common/LottieLoader'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/lib/firebase'
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { recognizeMultiple } from '@/lib/ocr/recognize'
import { tutorCategorize } from '@/lib/agent/tutor/categorize'
import { generateTutorReportWithGemini } from '@/lib/ai/gemini'
import TutorReportModal from '@/components/agent/tutor/TutorReportModal'
import { uploadTutorImageWeb } from '@/lib/tutorImageStorage'

function messagesKey(uid: string | null, threadId: string) { return `lival_tutor_messages_${uid ?? 'guest'}_${threadId}` }

export default function TutorThreadPage() {
  const { user, loading } = useAuth()
  const params = useParams<{ threadId: string }>()
  const threadId = params?.threadId
  const [messages, setMessages] = useState<TutorChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportEngine, setReportEngine] = useState<'gpt' | 'gemini'>('gpt')
  const [reportPreview, setReportPreview] = useState<{ text: string; title: string; engine?: 'gpt' | 'gemini' } | null>(null)
  const [reportGenerating, setReportGenerating] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (loading || !threadId) return
    const seed = async () => {
      const raw = localStorage.getItem(messagesKey(user?.uid ?? null, threadId))
      let list: TutorChatMessage[] = raw ? JSON.parse(raw).map((m: any) => { const { animate, ...rest } = m; return rest }) : []
      if (user) {
        const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
        await setDoc(threadRef, { id: threadId, title: 'Tutor スレッド', agent: 'tutor', archived: false, updatedAt: serverTimestamp() }, { merge: true })
        const col = collection(threadRef, 'messages')
        const q = query(col, orderBy('createdAt', 'asc'), limit(50))
        const snap = await getDocs(q)
        const remote = snap.docs.map(d => {
          const v = d.data() as any
          const base: TutorChatMessage = { id: d.id, fsId: d.id, role: v.role, content: v.content, createdAt: v.createdAt?.toMillis?.() || Date.now(), hasImage: !!v.hasImage, imageStorageUrls: v.imageStorageUrls || [], tags: v.tags || [] }
          if (v.kind === 'report_log') {
            base.type = 'report_log'
            base.reportEngine = v.reportEngine
            base.reportTextContent = v.reportTextContent
            base.reportTitle = v.reportTitle
          }
          return base
        })
        if (list.length === 0 && remote.length > 0) list = remote
      }
      setMessages(list)
    }
    seed()
  }, [loading, user?.uid, threadId])

  const persistMessages = (next: TutorChatMessage[]) => {
    if (!threadId) return
    setMessages(next)
    const sanitized = next.map(({ animate, ...rest }) => rest)
    localStorage.setItem(messagesKey(user?.uid ?? null, threadId), JSON.stringify(sanitized))
  }

  const appendMessage = async (msg: TutorChatMessage, opts?: { kind?: string; saveRemote?: boolean }) => {
    if (!threadId) return
    const baseRaw = localStorage.getItem(messagesKey(user?.uid ?? null, threadId))
    const base: TutorChatMessage[] = baseRaw ? JSON.parse(baseRaw) : []
    const next = [...base, msg]
    persistMessages(next)
    if (user && (opts?.saveRemote ?? true)) {
      try {
        const threadRef = doc(db, 'users', user.uid, 'eduAI_threads', threadId)
        const col = collection(threadRef, 'messages')
        const docData: any = { role: msg.role, agent: 'tutor', content: msg.content, hasImage: !!msg.hasImage, imageStorageUrls: msg.imageStorageUrls || [], tags: msg.tags || [], kind: opts?.kind || (msg.role === 'user' ? 'ask' : 'chitchat'), createdAt: serverTimestamp() }
        if (opts?.kind === 'report_log' || msg.type === 'report_log') {
          docData.reportEngine = msg.reportEngine
          docData.reportTextContent = msg.reportTextContent
          docData.reportTitle = msg.reportTitle
        }
        const batch = writeBatch(db)
        const newMsgRef = doc(col)
        batch.set(newMsgRef, docData)
        const updates: any = { updatedAt: serverTimestamp() }
        // 初回ユーザー発話でスレッドタイトルを生成
        if (base.length === 0 && msg.role === 'user') {
          const t = (msg.content || 'Tutor スレッド').slice(0, 30)
          updates.title = t
        }
        batch.set(threadRef, updates, { merge: true })
        await batch.commit()
        // fsId をローカルにも反映
        setMessages((prev) => {
          const patched = prev.map((m, idx) => (idx === prev.length - 1 && m.id === msg.id) ? { ...m, fsId: newMsgRef.id } : m)
          const sanitized = patched.map(({ animate, ...rest }) => rest)
          if (threadId) localStorage.setItem(messagesKey(user?.uid ?? null, threadId), JSON.stringify(sanitized))
          return patched
        })
      } catch (e) {
        console.error('Failed to write message batch:', e)
        setToast('メッセージの保存に失敗しました（ローカルには保存されました）')
      }
    }
  }

  const recentMessagesForFn = () => messages.slice(-8).map(m => ({ role: m.role, content: m.content }))

  const onSend = async ({ text, images, files }: { text: string; images: string[]; files: File[] }) => {
    if (!user || !threadId) return
    setBusy(true)
    const messageId = crypto.randomUUID()
    let imageStorageUrls: string[] = []
    try {
      // 直近履歴に今回のユーザー発話を含めた配列を作成（状態反映の遅延対策）
      const historyForApi = [
        ...recentMessagesForFn(),
        { role: 'user' as const, content: userMsg.content },
      ]
      if (files?.length) {
        const results = await Promise.all(files.map((f) => uploadTutorImageWeb(f, threadId, messageId)))
        imageStorageUrls = results.map(r => r.storageUrl)
      }
    } catch {}
    const userMsg: TutorChatMessage = { id: messageId, role: 'user', content: text || ((images.length || imageStorageUrls.length) ? '画像を送信しました' : ''), createdAt: Date.now(), hasImage: (images.length + imageStorageUrls.length) > 0, imageStorageUrls }
    await appendMessage(userMsg, { kind: 'ask' })
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
    try {
      // 1st choice: Cloud Run API 経由
      const payload = { threadId, messages: historyForApi, images, storageUrls: imageStorageUrls }
      const token = await user.getIdToken()
      const res = await fetch('/api/tutor/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      if (res.ok) {
        const data = await res.json()
        const textAns = data?.text || '回答を生成できませんでした。'
        await appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: textAns, createdAt: Date.now(), hasImage: false, animate: true })
      } else {
        // Fallback: Firebase Functions 経由（後方互換）
        let ocrText = ''
        try {
          if ((images.length + imageStorageUrls.length) > 0 && images.length) {
            ocrText = await recognizeMultiple(images)
          }
        } catch {}

        try {
          if ((images.length + imageStorageUrls.length) > 0) {
            // 画像あり用 Functions（科目分類→関数分岐）
            const pillar = await tutorCategorize(text, ocrText, historyForApi)
            const map: Record<string, string> = { science: 'scienceTutor', japanese: 'JapaneseTutor', english: 'EnglishTutor', knowledge: 'knowledgeTutor', other: 'knowledgeTutor' }
            const fnName = pillar ? map[pillar] : 'knowledgeTutor'
            const tutorFn = httpsCallable(functions, fnName)
            const resp = await tutorFn({ messages: historyForApi, images })
            const textAns = (resp.data as any)?.text || '回答を生成できませんでした。'
            await appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: textAns, createdAt: Date.now(), hasImage: false, animate: true })
          } else {
            // テキストのみ
            const tutorText = httpsCallable(functions, 'tutorTextAnswer')
            const resp = await tutorText({ userText: text, history: historyForApi })
            const textAns = (resp.data as any)?.text || '回答を生成できませんでした。'
            await appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: textAns, createdAt: Date.now(), animate: true })
          }
        } catch (e) {
          // 最終フォールバック: OCR文字列を本文に付与してテキスト関数へ
          try {
            const fallbackText = ocrText ? `${text}\n\n【画像テキスト】\n${ocrText}` : text
            const tutorText = httpsCallable(functions, 'tutorTextAnswer')
            const resp = await tutorText({ userText: fallbackText, history: historyForApi })
            const textAns = (resp.data as any)?.text || '回答を生成できませんでした。'
            await appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: textAns, createdAt: Date.now(), animate: true })
          } catch (e2) {
            throw e2
          }
        }
      }
    } catch (e) {
      // 失敗詳細を一時ログ（開発支援用）
      try { console.error('[tutor] send_error', e) } catch {}
      await appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: 'エラーが発生しました。時間をおいて再試行してください。', createdAt: Date.now() })
    } finally { setBusy(false) }
  }

  const onChangeTags = (id: string, tags: TutorTag[]) => { setMessages(prev => prev.map(m => m.id === id ? { ...m, tags } : m)) }

  const generateReport = async (engine: 'gpt' | 'gemini' = 'gpt') => {
    if (!user || !threadId) return
    const tagged = messages.filter(m => (m.tags || []).length > 0)
    if (tagged.length === 0) return alert('タグ付きメッセージがありません')
    try {
      setReportGenerating(true)
      if (engine === 'gpt') {
        const fn = httpsCallable(functions, 'reportGenerater')
        const res = await fn({ threadId, taggedMessages: tagged.map(m => ({ role: m.role, content: m.content, tags: m.tags, at: m.createdAt })), options: { focus: ['important','memorize','review'] } })
        const text = (res.data as any)?.text || 'レポートの生成に失敗しました'
        const reportMsg: TutorChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: 'report_log', createdAt: Date.now(), type: 'report_log', reportEngine: 'gpt', reportTextContent: text, reportTitle: 'Tutorレポート' }
        await appendMessage(reportMsg, { kind: 'report_log' })
        setToast('レポートを作成しました')
      } else {
        const text = await generateTutorReportWithGemini({ threadId, taggedMessages: tagged.map(m => ({ role: m.role, content: m.content, tags: m.tags, at: m.createdAt })), focus: ['important','memorize','review'], model: 'gemini-1.5-flash' })
        const reportMsg: TutorChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: 'report_log', createdAt: Date.now(), type: 'report_log', reportEngine: 'gemini', reportTextContent: text, reportTitle: 'Tutorレポート' }
        await appendMessage(reportMsg, { kind: 'report_log' })
        setToast('レポートを作成しました')
      }
    } catch (e) {
      setToast('レポートの作成に失敗しました')
    } finally { setReportGenerating(false) }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages.length, busy])

  // Tutor ヘッダーのモーダルイベント
  useEffect(() => {
    const handler = () => setReportOpen(true)
    if (typeof window !== 'undefined') window.addEventListener('tutor-open-report-modal', handler as EventListener)
    return () => { if (typeof window !== 'undefined') window.removeEventListener('tutor-open-report-modal', handler as EventListener) }
  }, [])

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border bg-white p-6 text-center">
          <h2 className="mb-2 text-xl font-bold">ログインが必要です</h2>
          <p className="mb-6 text-gray-600">Tutor AI を利用するにはログインまたは新規登録してください。</p>
          <div className="flex justify-center gap-3">
            <a href="/login" className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">ログイン</a>
            <a href="/signup" className="rounded-md border px-4 py-2 hover:bg-gray-50">新規登録</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto min-h-[100dvh] max-w-7xl">
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
      
      {toast && (
        <div className="pointer-events-none fixed right-4 top-16 z-50 rounded-md border border-emerald-200 bg-white/95 px-3 py-2 text-sm text-emerald-700 shadow-md">{toast}</div>
      )}
      <div className="relative z-10 mx-auto max-w-3xl space-y-3 p-4 pb-32 sm:pb-40">
        {messages.map((m) => (
          <div key={m.id} className="animate-fade-in">
            <TutorChatMessageView msg={m} enableTagging uid={user?.uid ?? null} threadId={threadId || null} onChangeTags={(id, tags) => setMessages(prev => prev.map(x => x.id===id?{...x, tags}:x))} onOpenReport={(p)=> setReportPreview(p)} />
          </div>
        ))}
        {busy && (
          <div className="my-2 flex items-center gap-2 text-gray-600">
            <div className="max-w-[80%] rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2"><LottieLoader size={28} /><span className="text-gray-700">回答を作成中…</span></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-20" />
      </div>
      <TutorInputBar disabled={busy} onSend={onSend} />
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setReportOpen(false)} />
          <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
            <h3 className="mb-2 text-base font-semibold text-gray-900">レポートを作成</h3>
            <p className="mb-3 text-sm text-gray-600">エンジンを選択し、タグ付きメッセージを元に要約レポートを生成します。</p>
            <div className="mb-3">
              <div className="mb-1 text-xs font-medium text-gray-700">エンジン選択</div>
              <div className="flex gap-2">
                <button onClick={() => setReportEngine('gpt')} className={`rounded-md border px-3 py-1.5 text-xs ${reportEngine==='gpt' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>GPT</button>
                <button onClick={() => setReportEngine('gemini')} className={`rounded-md border px-3 py-1.5 text-xs ${reportEngine==='gemini' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Gemini</button>
              </div>
            </div>
            <div className="mb-3 rounded-md bg-gray-50 p-3 text-sm">
              <div className="mb-1 text-gray-800">このスレッドのタグ付きメッセージ数: <span className="font-semibold">{messages.filter(m => (m.tags||[]).length>0).length}</span></div>
              <ul className="list-disc pl-5 text-gray-600">
                <li>重要: <code className="rounded bg-white px-1">important</code></li>
                <li>暗記: <code className="rounded bg-white px-1">memorize</code></li>
                <li>確認: <code className="rounded bg-white px-1">check</code></li>
              </ul>
              <div className="mt-2 text-xs text-gray-500">ヒント: 大事な要点や覚えたい定義には <b>important/memorize</b>、あとで検算・見直ししたい部分には <b>check</b> を付けると、より使えるレポートになります。</div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setReportOpen(false)} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">キャンセル</button>
              <button onClick={async () => { setReportOpen(false); await generateReport(reportEngine) }} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">作成する</button>
            </div>
          </div>
        </div>
      )}
      {reportPreview && (
        <TutorReportModal open={true} onClose={() => setReportPreview(null)} reportText={reportPreview.text} title={reportPreview.title} onDownloaded={(kind)=> setToast(kind==='pdf'?'PDFを保存しました':'画像を書き出しました')} />
      )}
      {reportGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex items-center gap-3 rounded-md border bg-white px-4 py-3 shadow"><LottieLoader size={40} /><span className="text-sm text-gray-800">レポートを作成しています…</span></div>
        </div>
      )}
    </div>
  )
}
