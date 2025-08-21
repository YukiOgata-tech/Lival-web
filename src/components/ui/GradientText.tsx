// src/components/ui/GradientText.tsx
'use client'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: 'blue-purple' | 'purple-pink' | 'blue-green' | 'orange-red'
}

export function GradientText({ 
  children, 
  className,
  gradient = 'blue-purple' 
}: GradientTextProps) {
  const gradients = {
    'blue-purple': 'from-blue-600 to-purple-600',
    'purple-pink': 'from-purple-600 to-pink-600',
    'blue-green': 'from-blue-600 to-green-600',
    'orange-red': 'from-orange-600 to-red-600'
  }

  return (
    <span className={cn(
      'bg-gradient-to-r bg-clip-text text-transparent font-bold',
      gradients[gradient],
      className
    )}>
      {children}
    </span>
  )
}