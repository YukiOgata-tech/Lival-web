'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

type TutorChatHeaderProps = {
  quality: 'fast' | 'standard'
  setQuality: (quality: 'fast' | 'standard') => void
}

export default function TutorChatHeader({ quality, setQuality }: TutorChatHeaderProps) {
  const router = useRouter()
  const goThreads = () => {
    try {
      if (typeof window !== 'undefined') {
        router.push('/lival-agent-mode/threads/')
      }
    } catch {}
  }
  const openReport = () => {
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tutor-open-report-modal'))
      }
    } catch {}
  }
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top row: navigation and actions */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 whitespace-nowrap sm:gap-3">
          <motion.button
            onClick={goThreads}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="スレッド一覧"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4A1 1 0 018.707 6.707L6.414 9H17a1 1 0 110 2H6.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
            <span className="hidden sm:inline">スレッド一覧</span>
          </motion.button>
          <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:text-xs">Chat</span>
          <span className="ml-1 truncate text-xs text-gray-600 sm:ml-2 sm:text-sm">Tutor AI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-gray-500 sm:inline">画像付きの質問に対応</span>
          <motion.button
            type="button"
            onClick={openReport}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v9.5A1.5 1.5 0 003.5 16h9a1.5 1.5 0 001.5-1.5V12h2a2 2 0 002-2V5a2 2 0 00-2-2H4zm10 3H6a1 1 0 000 2h8a1 1 0 100-2zM6 9h6a1 1 0 110 2H6a1 1 0 110-2z"/></svg>
            レポート作成
          </motion.button>
        </div>
      </div>

      {/* Bottom row: quality selector */}
      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
              <span>回答スタイル</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setQuality('fast')}
                className={`rounded-full px-3 py-1 font-medium transition-all border ${
                  quality === 'fast'
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                高速
              </button>
              <button
                type="button"
                onClick={() => setQuality('standard')}
                className={`rounded-full px-3 py-1 font-medium transition-all border ${
                  quality === 'standard'
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                標準
              </button>
              <button
                type="button"
                disabled
                className="hidden sm:inline-flex rounded-full px-3 py-1 text-[11px] font-medium border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                title="思考モードはモバイルアプリ限定です"
              >
                thinking（アプリ限定）
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
