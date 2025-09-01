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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600">
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="inline-flex items-center gap-2">
              <Image src="/images/Lival-text.png" alt="Lival" width={100} height={24} className="h-6 w-auto" />
              <span>Lival Agent Mode</span>
            </motion.div>
          </Link>
          <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            Chat
          </span>
          <span className="ml-2 text-sm text-gray-500">Planner AI</span>
        </div>

        <div className="flex items-center gap-2">
          {sharedMsg && (
            <span className="hidden rounded bg-gray-800 px-2 py-1 text-xs text-white sm:inline-block">{sharedMsg}</span>
          )}
          <motion.button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            title="ページを再読み込み"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCcw className="h-4 w-4" />
            リロード
          </motion.button>
          <motion.button
            type="button"
            onClick={sharePage}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="h-4 w-4" />
            ページ共有
          </motion.button>
          <Link
            href="/subscription"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <CreditCard className="h-4 w-4" />
            申し込み・プラン
          </Link>
        </div>
      </div>
    </header>
  )
}
