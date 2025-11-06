'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, BookOpen, ChevronUp } from 'lucide-react'
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
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // スクロール検知（モバイルのみ）
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          // スマホサイズのみスクロールで非表示
          if (window.innerWidth < 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              setIsVisible(false)
            } else if (currentScrollY < lastScrollY) {
              setIsVisible(true)
            }
          }
          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

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
    <>
      {/* フローティングボタン（モバイルで非表示時のみ） */}
      <AnimatePresence>
        {!isVisible && window.innerWidth < 768 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(true)}
            className="fixed right-4 bottom-4 z-50 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-2xl hover:shadow-blue-300"
            aria-label="入力欄を表示"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          y: isVisible ? 0 : '100%',
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-gradient-to-b from-white/80 to-white/95 backdrop-blur-xl safe-area-inset-bottom shadow-2xl"
      >
        <div className="mx-auto max-w-4xl p-4 pb-4">
        {/* ヘッダー行: 作成モードボタン */}
        <div className="flex items-center justify-end mb-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGenerateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-4 h-4" />
            作成モード
          </motion.button>
        </div>

        {mode === 'chat' ? (
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendChat()
                  }
                }}
                onFocus={() => window.dispatchEvent(new CustomEvent('planner-input-focus'))}
                placeholder="メッセージを入力してください..."
                rows={1}
                className="w-full min-h-[48px] max-h-32 resize-none text-gray-900 bg-white placeholder:text-gray-400 rounded-xl border-2 border-gray-200 px-4 py-3 text-base shadow-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                style={{ fontSize: '16px' }}
              />
              {text.trim() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </motion.div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendChat}
              disabled={disabled || !text.trim()}
              className={`flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3.5 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all ${
                disabled || !text.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        ) : null}
      </div>

      <PlannerGenerateModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerate={(session) => onGenerate(session)}
      />
    </motion.div>
    </>
  )
}
