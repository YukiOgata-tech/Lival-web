// src/components/ui/Button.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children: React.ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = [
    'inline-flex items-center justify-center font-semibold rounded-full',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-[1.02] active:scale-[0.98]',
    fullWidth && 'w-full'
  ].filter(Boolean).join(' ')
  
  const variants = {
    primary: [
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      'hover:from-blue-700 hover:to-blue-800',
      'focus:ring-blue-500',
      'shadow-lg hover:shadow-xl',
      'border border-transparent'
    ].join(' '),
    
    secondary: [
      'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
      'hover:from-gray-700 hover:to-gray-800',
      'focus:ring-gray-500',
      'shadow-lg hover:shadow-xl',
      'border border-transparent'
    ].join(' '),
    
    outline: [
      'border-2 border-blue-600 text-blue-600 bg-transparent',
      'hover:bg-blue-50 hover:border-blue-700',
      'focus:ring-blue-500',
      'dark:border-blue-400 dark:text-blue-400',
      'dark:hover:bg-blue-950'
    ].join(' '),
    
    ghost: [
      'text-gray-700 bg-transparent border border-transparent',
      'hover:bg-gray-100 hover:text-gray-900',
      'focus:ring-gray-500',
      'dark:text-gray-300 dark:hover:bg-gray-800',
      'dark:hover:text-gray-100'
    ].join(' '),
    
    gradient: [
      'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white',
      'hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
      'focus:ring-purple-500',
      'shadow-lg hover:shadow-xl',
      'border border-transparent',
      'relative overflow-hidden'
    ].join(' ')
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
    xl: 'px-10 py-5 text-xl min-h-[60px]'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  return (
    <motion.button
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98,
        transition: { duration: 0.1 }
      }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* グラデーントボタン用のアニメーション背景 */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 transition-opacity duration-300"
          whileHover={{ opacity: 1 }}
        />
      )}
      
      {/* コンテンツ */}
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <div className={cn(
              'border-2 border-current border-t-transparent rounded-full animate-spin',
              iconSizes[size],
              'mr-2'
            )} />
            <span>読み込み中...</span>
          </motion.div>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={cn(iconSizes[size], 'mr-2')} />
            )}
            
            <span>{children}</span>
            
            {Icon && iconPosition === 'right' && (
              <Icon className={cn(iconSizes[size], 'ml-2')} />
            )}
          </>
        )}
      </div>
    </motion.button>
  )
}

// エクスポート用の型定義
export type { ButtonProps }