'use client'

import React, { useMemo } from 'react'
import MarkdownMessage from '@/components/agent/common/MarkdownMessage'
import { motion } from 'framer-motion'
import PlanCard from '@/components/agent/planner/PlanCard'
import { BookOpen, Sparkles } from 'lucide-react'

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
    return <PlanCard planCard={planCard} onPlanAction={onPlanAction} />
  }

  const isUser = msg.role === 'user'
  const shouldAnimate = !isUser && !planCard && msg.animate

  if (shouldAnimate && isUser === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
        className="flex items-start gap-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex-shrink-0 mt-1"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[85%] rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-lg ring-1 ring-gray-50"
        >
          <TypeReveal text={msg.content} />
        </motion.div>
      </motion.div>
    )
  }
  if (!isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
        className="flex items-start gap-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex-shrink-0 mt-1"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="max-w-[85%] rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-lg ring-1 ring-gray-50"
        >
          <MarkdownMessage text={msg.content} />
        </motion.div>
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={msg.animate ? { opacity: 0, y: 10, scale: 0.95 } : false}
      animate={msg.animate ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
      className="flex items-end gap-2 justify-end"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-3 text-sm text-white shadow-lg"
      >
        {msg.content}
      </motion.div>
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
    </motion.div>
  )
}

function TypeReveal({ text }: { text: string }) {
  const [shown, setShown] = React.useState('')
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    let i = 0
    const step = Math.max(1, Math.floor(text.length / 60))
    const timer = setInterval(() => {
      i = Math.min(text.length, i + step)
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, 20)
    return () => clearInterval(timer)
  }, [text])

  // アニメーション完了後はMarkdownでレンダリング
  if (isComplete) {
    return <MarkdownMessage text={text} />
  }

  return (
    <span className="text-gray-900">
      {shown}
      {/* ChatGPT風のカーソル（滑らかなアニメーション） */}
      <span
        className="ml-0.5 inline-block h-4 w-[2px] bg-gray-900 align-middle animate-pulse"
        style={{
          animationDuration: '1s',
          animationTimingFunction: 'ease-in-out'
        }}
      />
    </span>
  )
}
