'use client'

import { motion } from 'framer-motion'

export type TabKey = 'threads' | 'chat'

export default function TopTabs({
  active,
  onChange,
  tabs = [
    { key: 'threads' as TabKey, label: 'スレッド' },
    { key: 'chat' as TabKey, label: 'チャット' },
  ],
}: {
  active: TabKey
  onChange: (key: TabKey) => void
  tabs?: Array<{ key: TabKey; label: string }>
}) {
  return (
    <div className="sticky top-[48px] z-30 -mb-px flex gap-1 overflow-x-auto border-b bg-white/80 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/60 sm:top-[56px] sm:px-6">
      {tabs.map((t) => {
        const isActive = t.key === active
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`relative inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t.label}
            {isActive && (
              <motion.span layoutId="tutor-tabs-underline" className="absolute inset-x-1 -bottom-1 block h-0.5 rounded bg-emerald-600" />
            )}
          </button>
        )
      })}
    </div>
  )
}

