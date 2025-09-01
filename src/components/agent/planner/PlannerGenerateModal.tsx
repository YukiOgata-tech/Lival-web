'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, CalendarDays, Target, Timer, X } from 'lucide-react'

type Session = {
  horizonText?: string
  priorities?: string[]
  goalText?: string
  dailyCapMin?: number
}

export default function PlannerGenerateModal({
  open,
  onClose,
  onGenerate,
}: {
  open: boolean
  onClose: () => void
  onGenerate: (s: Session) => void
}) {
  const [horizonText, setHorizonText] = useState('')
  const [priorities, setPriorities] = useState('')
  const [goalText, setGoalText] = useState('')
  const [dailyCapMin, setDailyCapMin] = useState<number | ''>('')

  useEffect(() => {
    if (!open) {
      setHorizonText('')
      setPriorities('')
      setGoalText('')
      setDailyCapMin('')
    }
  }, [open])

  const submit = () => {
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
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            initial={{ y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="inline-flex items-center gap-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div className="font-semibold">プラン作成</div>
              </div>
              <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <CalendarDays className="h-4 w-4" /> 期間（自由入力 or 1w/2w/1m/2m）
                </span>
                <input
                  value={horizonText}
                  onChange={(e) => setHorizonText(e.target.value)}
                  placeholder="例: 45日 / 1m"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  {['1w', '2w', '1m', '2m'].map((h) => (
                    <button
                      key={h}
                      onClick={() => setHorizonText(h)}
                      className={`rounded-full px-3 py-1 ${horizonText === h ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      type="button"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Target className="h-4 w-4" /> 重要視ポイント（カンマ区切り）
                </span>
                <input
                  value={priorities}
                  onChange={(e) => setPriorities(e.target.value)}
                  placeholder="例: 英語 長文, 数学 微積"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  {['英語 長文', '数学 微積', '理科 基礎', '社会 暗記'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorities((priorities ? priorities + ', ' : '') + p)}
                      className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
                      type="button"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Target className="h-4 w-4" /> 目標（任意）
                </span>
                <input
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="例: 定期テストで+10点 / 模試偏差値+5"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Timer className="h-4 w-4" /> 1日の上限（分）
                </span>
                <input
                  value={dailyCapMin}
                  onChange={(e) => setDailyCapMin(e.target.value === '' ? '' : Number(e.target.value))}
                  type="number"
                  min={0}
                  placeholder="例: 60"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
              <button
                onClick={onClose}
                className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                閉じる
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={submit}
                className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700"
              >
                プラン作成
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

