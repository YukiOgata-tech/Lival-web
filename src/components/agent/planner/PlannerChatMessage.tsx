'use client'

import React, { useMemo } from 'react'
import MarkdownMessage from '@/components/agent/common/MarkdownMessage'
import { motion } from 'framer-motion'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  animate?: boolean
}

function tryParsePlanCard(content: string): null | {
  text: string
  plan?: any
  versionLabel?: string
} {
  if (!content.startsWith('__PLAN_CARD__:')) return null
  try {
    const encoded = content.replace('__PLAN_CARD__:', '')
    const json = decodeURIComponent(encoded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default function PlannerChatMessage({
  msg,
  onPlanAction,
}: {
  msg: ChatMessage
  onPlanAction?: (action: 'detail' | 'pdf' | 'regenerate' | 'new-thread', payload: any) => void
}) {
  const planCard = useMemo(() => tryParsePlanCard(msg.content), [msg.content])

  if (planCard) {
    return (
      <motion.div
        className="my-2 flex justify-start"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="relative max-w-[80%] overflow-hidden rounded-xl bg-white p-4 shadow-md ring-1 ring-gray-200">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-cyan-400" />
          <div className="mb-2 flex items-center gap-2 pl-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">P</span>
            <span className="text-xs font-semibold text-gray-900">Planner 生成プラン</span>
          </div>
          <div className="pl-2">
            <div className="whitespace-pre-wrap text-sm text-gray-800">{planCard.text?.slice(0, 220)}{planCard.text && planCard.text.length > 220 ? '…' : ''}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {planCard.versionLabel && (
                <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700">{planCard.versionLabel}</span>
              )}
              {planCard.plan?.dailyBudgetMin && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">/日 {planCard.plan.dailyBudgetMin}分</span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPlanAction?.('detail', planCard)}
                className="rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              >
                詳しく
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPlanAction?.('pdf', planCard)}
                className="rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              >
                PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPlanAction?.('regenerate', planCard)}
                className="rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              >
                再作成
              </motion.button>
              {/* 別スレッドで新規はPlanCardから外し、キーボード上バーで案内 */}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const isUser = msg.role === 'user'
  const shouldAnimate = !isUser && !planCard && msg.animate

  if (shouldAnimate && isUser === false) {
    return (
      <div className="my-3 text-gray-900">
        <TypeReveal text={msg.content} />
      </div>
    )
  }
  if (!isUser) {
    return (
      <div className="my-3 text-gray-900">
        <MarkdownMessage text={msg.content} />
      </div>
    )
  }
  return (
    <motion.div className="my-2 flex justify-end" initial={msg.animate ? { opacity: 0, y: 8 } : false} animate={msg.animate ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.18, ease: 'easeOut' }}>
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white">{msg.content}</div>
    </motion.div>
  )
}

function TypeReveal({ text }: { text: string }) {
  const [shown, setShown] = React.useState('')
  React.useEffect(() => {
    let i = 0
    const step = Math.max(1, Math.floor(text.length / 60))
    const timer = setInterval(() => {
      i = Math.min(text.length, i + step)
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [text])
  return (
    <span>
      {shown}
      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-gray-500 align-middle" />
    </span>
  )
}
