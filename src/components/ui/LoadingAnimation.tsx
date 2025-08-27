'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'

interface LoadingAnimationProps {
  type?: 'book-search' | 'study-log'
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingAnimation({ 
  type = 'book-search', 
  message, 
  size = 'md',
  className = '' 
}: LoadingAnimationProps) {
  // ローディングアニメーションデータを動的にインポート
  const [animationData, setAnimationData] = React.useState(null)

  React.useEffect(() => {
    const loadAnimation = async () => {
      try {
        const animationPath = type === 'study-log' 
          ? '/lotties/file-loading.json'
          : '/lotties/sandy-loading.json'
        
        const response = await fetch(animationPath)
        const data = await response.json()
        setAnimationData(data)
      } catch (error) {
        console.error('Failed to load animation:', error)
      }
    }

    loadAnimation()
  }, [type])

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  }

  const defaultMessages = {
    'book-search': '書籍を検索しています...',
    'study-log': '学習記録を読み込んでいます...'
  }

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        {animationData ? (
          <Lottie 
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          // フォールバック用のCSS spinner
          <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-full h-full" />
        )}
      </div>
      
      <motion.p 
        className="text-gray-600 text-center font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message || defaultMessages[type]}
      </motion.p>
      
      {/* ドット アニメーション */}
      <motion.div 
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

// プリセット用の個別コンポーネント
export function BookSearchLoading({ message, size = 'md', className }: Omit<LoadingAnimationProps, 'type'>) {
  return (
    <LoadingAnimation 
      type="book-search" 
      message={message} 
      size={size} 
      className={className} 
    />
  )
}

export function StudyLogLoading({ message, size = 'md', className }: Omit<LoadingAnimationProps, 'type'>) {
  return (
    <LoadingAnimation 
      type="study-log" 
      message={message} 
      size={size} 
      className={className} 
    />
  )
}