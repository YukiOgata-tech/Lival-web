// src/components/ui/ProgressBar.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number // 0-100
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'gradient'
}

export function ProgressBar({ 
  progress, 
  className, 
  showLabel = false,
  variant = 'default' 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            variant === 'gradient' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
              : 'bg-blue-600'
          )}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-gray-600 mt-1 text-right">
          {clampedProgress}%
        </div>
      )}
    </div>
  )
}