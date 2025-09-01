'use client'

import { useEffect, useState } from 'react'
import PlannerGenerateModal from '@/components/agent/planner/PlannerGenerateModal'

export type Mode = 'chat' | 'generate'

export default function PlannerInputBar({
  mode,
  setMode,
  disabled,
  onChat,
  onGenerate,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  disabled?: boolean
  onChat: (text: string) => void
  onGenerate: (session: {
    horizonText?: string
    priorities?: string[]
    goalText?: string
    dailyCapMin?: number
  }) => void
}) {
  const [text, setText] = useState('')
  const [horizonText, setHorizonText] = useState<string>('')
  const [priorities, setPriorities] = useState<string>('')
  const [goalText, setGoalText] = useState<string>('')
  const [dailyCapMin, setDailyCapMin] = useState<number | ''>('')

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (typeof detail === 'string') setText(detail)
    }
    window.addEventListener('planner-insert-text', handler as EventListener)
    const openGenerate = () => setGenerateOpen(true)
    window.addEventListener('planner-open-generate', openGenerate)
    return () => {
      window.removeEventListener('planner-insert-text', handler as EventListener)
      window.removeEventListener('planner-open-generate', openGenerate)
    }
  }, [])

  const sendChat = () => {
    if (!text.trim()) return
    onChat(text.trim())
    setText('')
  }

  const sendGenerate = () => {
    onGenerate({
      horizonText: horizonText || undefined,
      priorities: priorities
        ? priorities
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      goalText: goalText || undefined,
      dailyCapMin: typeof dailyCapMin === 'number' ? dailyCapMin : undefined,
    })
    // 送信直後はフォームを隠す（仕様）
    setHorizonText('')
    setPriorities('')
    setGoalText('')
    setDailyCapMin('')
    // 作成モードを閉じて通常チャットに戻す
    setMode('chat')
  }

  const [generateOpen, setGenerateOpen] = useState(false)

  return (
    <div className="border-t bg-white p-3">
      <div className="mx-auto flex max-w-4xl flex-col gap-2">
        {/* ヘッダー行: 通常モードはデフォルト。作成モードのみボタン表示 */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setGenerateOpen(true)}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            作成モード
          </button>
        </div>

        {mode === 'chat' ? (
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => window.dispatchEvent(new CustomEvent('planner-input-focus'))}
              placeholder="メッセージを入力..."
              rows={1}
              className="min-h-[44px] flex-1 resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={sendChat}
              disabled={disabled || !text.trim()}
              className="inline-flex h-[44px] items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              送信
            </button>
          </div>
        ) : null}
      </div>

      <PlannerGenerateModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerate={(session) => onGenerate(session)}
      />
    </div>
  )
}
