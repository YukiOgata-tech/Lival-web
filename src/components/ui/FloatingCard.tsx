// src/components/ui/FloatingCard.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function FloatingCard({ 
  children, 
  className, 
  delay = 0,
  direction = 'up' 
}: FloatingCardProps) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionMap[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20',
        className
      )}
    >
      {children}
    </motion.div>
  )
}