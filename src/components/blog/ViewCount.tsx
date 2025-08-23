// src/components/blog/ViewCount.tsx
'use client'

import { Eye } from 'lucide-react'

interface ViewCountProps {
  count?: number
  className?: string
}

export function ViewCount({ count = 0, className = '' }: ViewCountProps) {
  const formatCount = (num: number): string => {
    // Handle undefined or invalid numbers
    if (!num || typeof num !== 'number' || isNaN(num)) {
      return '0'
    }
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  return (
    <div className={`inline-flex items-center space-x-1 text-gray-500 text-sm ${className}`}>
      <Eye className="w-4 h-4" />
      <span>{formatCount(count)}</span>
    </div>
  )
}