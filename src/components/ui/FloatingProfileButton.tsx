'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { User, Settings, UserCheck } from 'lucide-react'
import { getUserProfile, checkProfileCompleteness } from '@/lib/supabase/userProfile'
import Lottie from 'lottie-react'

interface FloatingProfileButtonProps {
  className?: string
}

export default function FloatingProfileButton({ className = '' }: FloatingProfileButtonProps) {
  const { user, userData } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [lottieData, setLottieData] = useState(null)

  // ユーザーがログインしていて、プロファイルが未完成の場合のみ表示
  useEffect(() => {
    const checkProfile = async () => {
      if (user && userData) {
        try {
          const profile = await getUserProfile(user.uid)
          const { isComplete } = checkProfileCompleteness(profile)
          
          setHasProfile(isComplete)
          setIsVisible(!isComplete)
        } catch (error) {
          console.error('Error checking profile:', error)
          // エラーの場合は表示する（プロファイルが必要と想定）
          setHasProfile(false)
          setIsVisible(true)
        }
      } else {
        setIsVisible(false)
      }
    }

    checkProfile()
  }, [user, userData])

  // Lottieデータを読み込む
  useEffect(() => {
    const loadLottieData = async () => {
      try {
        const response = await fetch('/lotties/profile.json')
        if (response.ok) {
          const data = await response.json()
          setLottieData(data)
        }
      } catch (error) {
        console.error('Failed to load Lottie animation:', error)
      }
    }
    
    loadLottieData()
  }, [])

  const handleClick = () => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push('/dashboard/receptionAI')
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`fixed bottom-6 right-20 z-50 ${className}`}
      >
        {/* パルスエフェクトの背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-30"></div>
        
        {/* メインボタン */}
        <motion.button
          onClick={handleClick}
          className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
          whileHover={{ 
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" 
          }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Lottie アニメーションまたはフォールバックアイコン */}
          <div className="w-10 h-10 flex items-center justify-center">
            {lottieData ? (
              <Lottie 
                animationData={lottieData}
                loop={true}
                className="w-full h-full filter brightness-0 invert"
              />
            ) : (
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* ツールチップ */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ delay: 2, duration: 0.3 }}
            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-gray-700"
          >
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span>受付係へ！</span>
            </div>
            {/* 矢印 */}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {/* 通知バッジ */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
        >
          !
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// パルスボタンバリエーション（必要に応じて使用）
export function PulsingProfileButton({ className = '' }: FloatingProfileButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  
  const handleClick = () => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push('/dashboard/receptionAI')
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* パルスエフェクト */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
      <span className="relative inline-flex rounded-full h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 items-center justify-center">
        <Settings className="w-6 h-6 text-white" />
      </span>
    </motion.button>
  )
}

// よりシンプルなバージョン
export function SimpleProfileButton({ className = '' }: FloatingProfileButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // シンプル版では常に表示（プロファイル完成度チェックなし）
    setIsVisible(!!user)
  }, [user])

  const handleClick = () => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push('/dashboard/receptionAI')
  }

  if (!isVisible) return null

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <UserCheck className="w-7 h-7 text-white" />
    </motion.button>
  )
}