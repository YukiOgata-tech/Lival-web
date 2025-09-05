'use client'

import { useMemo, useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import MarkdownMessage from '@/components/agent/common/MarkdownMessage'

export type TutorTag = 'important' | 'memorize' | 'check'

export type TutorChatMessage = {
  id: string
  fsId?: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  hasImage?: boolean
  aiCode?: 'Sc' | 'Ja' | 'En' | 'Kn' | 'Ca' | 'general'
  tags?: TutorTag[]
  animate?: boolean
  // レポートログ専用フィールド
  type?: 'report_log'
  reportEngine?: 'gpt' | 'gemini'
  reportTextContent?: string
  reportTitle?: string
}

export default function TutorChatMessageView({
  msg,
  enableTagging,
  uid,
  threadId,
  onChangeTags,
  onOpenReport,
}: {
  msg: TutorChatMessage
  enableTagging?: boolean
  uid: string | null
  threadId: string | null
  onChangeTags?: (id: string, tags: TutorTag[]) => void
  onOpenReport?: (payload: { text: string; title: string; engine?: 'gpt' | 'gemini' }) => void
}) {
  const [localTags, setLocalTags] = useState<TutorTag[]>(msg.tags || [])

  const toggleTag = async (t: TutorTag) => {
    const next = localTags.includes(t) ? localTags.filter((x) => x !== t) : [...localTags, t]
    setLocalTags(next)
    onChangeTags?.(msg.id, next)
    // Firestore へ反映（fsId がある場合のみ）
    try {
      if (uid && threadId && msg.fsId) {
        const ref = doc(db, 'users', uid, 'eduAI_threads', threadId, 'messages', msg.fsId)
        await setDoc(ref, { tags: next }, { merge: true })
      }
    } catch {}
  }

  // レポートログ表示
  if (msg.type === 'report_log') {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">R</span>
              <div className="font-medium">レポートを作成しました</div>
            </div>
            <button
              onClick={() => onOpenReport?.({ text: msg.reportTextContent || msg.content, title: msg.reportTitle || 'Tutorレポート', engine: msg.reportEngine })}
              className="rounded-md border border-emerald-600 bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
            >プレビュー</button>
          </div>
          <div className="mt-1 text-xs text-emerald-800">エンジン: {msg.reportEngine?.toUpperCase?.() || 'GPT'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl border px-3 py-2 text-sm shadow-sm ${
        msg.role === 'user'
          ? 'bg-emerald-600 text-white border-emerald-600'
          : 'bg-white text-gray-900 border-gray-200 ring-1 ring-gray-100'
      }`}>
        {/* 画像添付フラグ */}
        {msg.hasImage && (
          <div className={`mb-1 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] ${msg.role === 'user' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-700'}`}>
            <span>画像付き</span>
          </div>
        )}
        <MessageContent msg={msg} />
        {/* タグ操作（アシスタント返答中心に付与） */}
        {enableTagging && msg.role === 'assistant' && (
          <div className="mt-2 flex flex-wrap gap-1">
            {(['important', 'memorize', 'check'] as TutorTag[]).map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`rounded border px-2 py-0.5 text-[11px] ${
                  localTags.includes(t)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                title={`タグ: ${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )}

function MessageContent({ msg }: { msg: TutorChatMessage }) {
  // ユーザー発話はそのまま（改行保持）
  if (msg.role === 'user') {
    return <div className="whitespace-pre-wrap leading-relaxed break-words">{msg.content}</div>
  }
  // アシスタント発話はタイプアニメーション→完了後にMarkdown描画
  return <AssistantContentWithTyping text={msg.content} animate={!!msg.animate} />
}

function AssistantContentWithTyping({ text, animate }: { text: string; animate: boolean }) {
  const [done, setDone] = useState(!animate)
  const [shown, setShown] = useState(animate ? '' : text)

  // タイピングアニメーション（完了後にKaTeX描画へ切替）
  useEffect(() => {
    if (!animate) return
    let i = 0
    const step = Math.max(1, Math.floor(text.length / 90))
    const timer = setInterval(() => {
      i = Math.min(text.length, i + step)
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setTimeout(() => setDone(true), 120) // 少し余韻を持たせてKaTeXに切替
      }
    }, 24)
    return () => clearInterval(timer)
  }, [animate, text])

  if (!done) {
    return (
      <div className="whitespace-pre-wrap leading-relaxed break-words text-gray-900">
        {shown}
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-gray-400 align-middle" />
      </div>
    )
  }
  return <MarkdownMessage text={text} />
}
