'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useImageCache } from '@/hooks/useImageCache'
import { updateMessageTags } from '@/lib/firebase/tutor'
import MarkdownMessage from '@/components/agent/common/MarkdownMessage'
import { Clock, AlertTriangle, Star, BookMarked, CheckCircle2, Sparkles } from 'lucide-react'

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
        className="flex justify-start"
      >
        <div className="max-w-[85%] rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-3 text-sm text-emerald-900 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <div className="font-bold">レポートを作成しました</div>
                <div className="text-xs text-emerald-700 mt-0.5">エンジン: {msg.reportEngine?.toUpperCase?.() || 'GPT'}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenReport?.({ text: msg.reportTextContent || msg.content, title: msg.reportTitle || 'Tutorレポート', engine: msg.reportEngine })}
              className="rounded-xl border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all hover:bg-emerald-700"
            >
              プレビュー
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  const isUser = msg.role === 'user';

  const tagIcons: Record<TutorTag, typeof Star> = {
    important: Star,
    memorize: BookMarked,
    check: CheckCircle2
  }

  const tagLabels: Record<TutorTag, string> = {
    important: '重要',
    memorize: '暗記',
    check: '確認'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex-shrink-0 mb-1"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}

      {isUser && msg.status !== 'sent' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 mb-1"
        >
          {msg.status === 'sending' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-5 h-5 text-emerald-500" />
            </motion.div>
          )}
          {msg.status === 'error' && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='text-red-500'
            >
              <AlertTriangle
                className="w-5 h-5 cursor-pointer hover:opacity-70"
                onClick={() => onRetry && msg.retryPayload && onRetry(msg.retryPayload)}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.div
        whileHover={isUser ? { scale: 1.02 } : {}}
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0'
            : 'bg-white text-gray-900 border border-gray-100 ring-1 ring-gray-50'
        }`}
      >
        {msg.hasImage && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
              isUser ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>画像付き</span>
          </motion.div>
        )}
        <MessageContent msg={msg} />
        {enableTagging && msg.role === 'assistant' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2"
          >
            {(['important', 'memorize', 'check'] as TutorTag[]).map((t) => {
              const Icon = tagIcons[t]
              const isActive = localTags.includes(t)
              return (
                <motion.button
                  key={t}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleTag(t)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                  title={`タグ: ${tagLabels[t]}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tagLabels[t]}</span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </motion.div>

      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex-shrink-0 mb-1"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">You</span>
          </div>
        </motion.div>
      )}
    </motion.div>
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
  // ストリーミング中（animate=true）はプレーンテキスト表示、完了後（animate=false）はMarkdown表示
  if (animate) {
    return (
      <div className="whitespace-pre-wrap leading-relaxed break-words text-gray-900">
        {text}
        {/* ChatGPT風のカーソル（滑らかなアニメーション） */}
        <span
          className="ml-0.5 inline-block h-4 w-[2px] bg-gray-900 align-middle animate-pulse"
          style={{
            animationDuration: '1s',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      </div>
    )
  }

  // アニメーション完了後、即座にMarkdownに切り替え（ChatGPT風）
  return <MarkdownMessage text={text} />
}
