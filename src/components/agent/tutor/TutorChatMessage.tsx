'use client'

import { useState, useEffect } from 'react'
import { useImageCache } from '@/hooks/useImageCache'
import { updateMessageTags } from '@/lib/firebase/tutor'
import MarkdownMessage from '@/components/agent/common/MarkdownMessage'
import { Clock, AlertTriangle } from 'lucide-react'

export type TutorTag = 'important' | 'memorize' | 'check'

// The payload required to retry sending a message
export type RetryPayload = {
  text: string;
  images: string[];
  files: File[];
}

export type TutorChatMessage = {
  id: string
  fsId?: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  hasImage?: boolean
  imageStorageUrls?: string[]
  tags?: TutorTag[]
  animate?: boolean
  // UI status for optimistic updates
  status?: 'sending' | 'sent' | 'error'
  retryPayload?: RetryPayload

  // Report log specific fields
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
  onRetry,
}: {
  msg: TutorChatMessage
  enableTagging?: boolean
  uid: string | null
  threadId: string | null
  onChangeTags?: (id: string, tags: TutorTag[]) => void
  onOpenReport?: (payload: { text: string; title: string; engine?: 'gpt' | 'gemini' }) => void
  onRetry?: (payload: RetryPayload) => void
}) {
  const [localTags, setLocalTags] = useState<TutorTag[]>(msg.tags || [])

  const toggleTag = async (t: TutorTag) => {
    if (!uid || !threadId || !msg.fsId) return;

    const next = localTags.includes(t) ? localTags.filter((x) => x !== t) : [...localTags, t]
    setLocalTags(next)
    onChangeTags?.(msg.id, next)
    
    try {
      await updateMessageTags(uid, threadId, msg.fsId, next)
    } catch (error) {
      // Revert local state on failure
      setLocalTags(localTags)
      onChangeTags?.(msg.id, localTags)
      // Optionally show a toast notification to the user
      console.error("Failed to update tags.");
    }
  }

  // Report Log View
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

  const isUser = msg.role === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
       {isUser && msg.status !== 'sent' && (
        <div className="flex-shrink-0 mb-1">
          {msg.status === 'sending' && <Clock className="w-4 h-4 text-gray-400 animate-spin" />}
          {msg.status === 'error' && (
            <div className='text-red-500'>
              <AlertTriangle
                className="w-5 h-5 cursor-pointer hover:opacity-70"
                onClick={() => onRetry && msg.retryPayload && onRetry(msg.retryPayload)}
              />
            </div>
          )}
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl border px-3 py-2 text-sm shadow-sm ${
        isUser
          ? 'bg-emerald-600 text-white border-emerald-600'
          : 'bg-white text-gray-900 border-gray-200 ring-1 ring-gray-100'
      }`}>
        {msg.hasImage && (
          <div className={`mb-1 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] ${isUser ? 'bg-white/20' : 'bg-emerald-50 text-emerald-700'}`}>
            <span>画像付き</span>
          </div>
        )}
        <MessageContent msg={msg} />
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
  )
}

function MessageContent({ msg }: { msg: TutorChatMessage }) {
  const { imageUrls, isLoading } = useImageCache(msg.imageStorageUrls);

  if (msg.imageStorageUrls && msg.imageStorageUrls.length > 0) {
    return (
      <div className="space-y-2">
        {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
            </div>
        ) : (
            <div className="flex flex-wrap gap-2">
            {imageUrls.map((u, i) => (
                <img key={i} src={u} alt={`img-${i}`} className="h-24 w-24 rounded object-cover border" />
            ))}
            </div>
        )}
        {msg.content && <div className="whitespace-pre-wrap leading-relaxed break-words">{msg.content}</div>}
      </div>
    )
  }

  if (msg.role === 'user') {
    return <div className="whitespace-pre-wrap leading-relaxed break-words">{msg.content}</div>
  }

  return <AssistantContentWithTyping text={msg.content} animate={!!msg.animate} />
}

function AssistantContentWithTyping({ text, animate }: { text: string; animate: boolean }) {
  const [done, setDone] = useState(!animate)
  const [shown, setShown] = useState(animate ? '' : text)

  useEffect(() => {
    if (!animate) return
    let i = 0
    const step = Math.max(1, Math.floor(text.length / 90))
    const timer = setInterval(() => {
      i = Math.min(text.length, i + step)
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setTimeout(() => setDone(true), 120)
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
