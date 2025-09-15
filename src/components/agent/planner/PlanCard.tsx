'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export type PlanCardData = {
  text: string
  plan?: any
  versionLabel?: string
}

export default function PlanCard({
  planCard,
  onPlanAction,
}: {
  planCard: PlanCardData
  onPlanAction?: (action: 'detail' | 'pdf' | 'regenerate' | 'new-thread', payload: any) => void
}) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  // キーボード検出
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        // iOS Safari: Visual Viewport API
        if ('visualViewport' in window) {
          const viewport = window.visualViewport as any
          const isKeyboard = viewport.height < window.innerHeight * 0.75
          setIsKeyboardOpen(isKeyboard)
        } else {
          // Android Chrome等: window.innerHeight
          const isKeyboard = window.innerHeight < window.screen.height * 0.75
          setIsKeyboardOpen(isKeyboard)
        }
      }
    }

    handleResize()

    if ('visualViewport' in window) {
      const viewport = window.visualViewport as any
      viewport.addEventListener('resize', handleResize)
      return () => viewport.removeEventListener('resize', handleResize)
    } else {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <motion.div
      className="my-2 flex justify-start"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="relative w-full max-w-[90%] overflow-hidden rounded-xl bg-white p-4 shadow-md ring-1 ring-gray-200">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-cyan-400" />
        
        <div className="mb-2 flex items-center gap-2 pl-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">P</span>
          <span className="text-xs font-semibold text-gray-900">Planner 生成プラン</span>
        </div>
        
        <div className="pl-2">
          <div className="whitespace-pre-wrap text-sm text-gray-800 mb-3">
            {planCard.text?.slice(0, 220)}{planCard.text && planCard.text.length > 220 ? '…' : ''}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
            {planCard.versionLabel && (
              <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700">{planCard.versionLabel}</span>
            )}
            {planCard.plan?.dailyBudgetMin && (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">/日 {planCard.plan.dailyBudgetMin}分</span>
            )}
          </div>
          
          {/* ボタングループ: キーボード状態に応じてレイアウト調整 */}
          <div 
            className={`
              flex flex-wrap gap-2 
              ${isKeyboardOpen 
                ? 'pb-2' // キーボードが開いている時は下部パディングを縮小
                : 'pb-0' // 通常時
              }
            `}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPlanAction?.('detail', planCard)}
              className="flex-1 min-w-[60px] rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
              style={{ fontSize: '16px' }} // ズーム防止
            >
              詳しく見る
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPlanAction?.('pdf', planCard)}
              className="flex-1 min-w-[60px] rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
              style={{ fontSize: '16px' }} // ズーム防止
            >
              PDF出力
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPlanAction?.('regenerate', planCard)}
              className="flex-1 min-w-[60px] rounded-md border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors"
              style={{ fontSize: '16px' }} // ズーム防止
            >
              再作成
            </motion.button>
          </div>
        </div>
        
        {/* キーボードが開いている時の視覚的な余白確保 */}
        {isKeyboardOpen && (
          <div className="h-2 bg-gradient-to-t from-gray-50 to-transparent rounded-b-xl" />
        )}
      </div>
    </motion.div>
  )
}