// src/components/ui/Card.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function Card({ children, className, hover = false, gradient = false }: CardProps) {
  const Component = hover ? motion.div : 'div'
  
  return (
    <Component
      {...(hover && {
        whileHover: { y: -5, scale: 1.02 },
        transition: { duration: 0.2 }
      })}
      className={cn(
        'rounded-2xl p-6 shadow-lg transition-all duration-300',
        gradient 
          ? 'bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm border border-white/20' 
          : 'bg-white border border-gray-100',
        hover && 'hover:shadow-xl',
        className
      )}
    >
      {children}
    </Component>
  )
}