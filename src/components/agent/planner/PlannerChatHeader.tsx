'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { RefreshCcw, Share2, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

type AgentKind = 'planner' | 'tutor' | 'counselor'

export default function PlannerChatHeader() {
  const [sharedMsg, setSharedMsg] = useState<string | null>(null)

  const sharePage = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : ''
      if ((navigator as any).share) {
        await (navigator as any).share({ title: 'Lival Agent Mode - Planner Chat', url })
        setSharedMsg('共有しました')
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        setSharedMsg('リンクをコピーしました')
      } else {
        setSharedMsg('このブラウザは共有に対応していません')
      }
    } catch (e) {
      setSharedMsg('共有に失敗しました')
    } finally {
      setTimeout(() => setSharedMsg(null), 2000)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2 sm:flex-nowrap sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600">
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="inline-flex items-center gap-2">
              <Image src="/images/Lival-text.png" alt="Lival" width={100} height={24} className="h-5 w-auto sm:h-6" />
              <span className="text-sm sm:text-base">Lival Agent Mode</span>
            </motion.div>
          </Link>
          <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 sm:text-xs">
            Chat
          </span>
          <span className="ml-1 truncate text-xs text-gray-500 sm:ml-2 sm:text-sm">Planner AI</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {sharedMsg && (
            <span className="hidden rounded bg-gray-800 px-2 py-1 text-xs text-white sm:inline-block">{sharedMsg}</span>
          )}
          <motion.button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gray-600 text-white hover:bg-gray-700 sm:h-9 sm:w-9"
            title="ページを再読み込み"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCcw className="h-4 w-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={sharePage}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">ページ共有</span>
          </motion.button>
          <Link
            href="/subscription"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">申し込み・プラン</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
