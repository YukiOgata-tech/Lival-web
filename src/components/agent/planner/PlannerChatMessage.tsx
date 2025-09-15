'use client'

import React, { useMemo } from 'react'
import MarkdownMessage from '@/components/agent/common/MarkdownMessage'
import { motion } from 'framer-motion'
import PlanCard from '@/components/agent/planner/PlanCard'

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
